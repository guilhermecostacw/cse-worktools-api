import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryParamDto } from 'src/query_params/dto/query-params.dto';
import { CategoryService } from 'src/category/category.service';
import { User } from '@prisma/client';

type LinkData = Omit<CreateLinkDto, 'queryParams'>;

@Injectable()
export class LinkService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categoryService: CategoryService,
  ) {}

  async create(createLinkDto: CreateLinkDto, user: User) {
    if (createLinkDto.isGeneral && user.role !== 'Admin') {
      throw new UnauthorizedException('Only admins can create general links.');
    }

    if (
      createLinkDto.categoryId &&
      !(await this.categoryService.isValidCategory(createLinkDto.categoryId))
    ) {
      throw new NotFoundException(
        `Category with ID ${createLinkDto.categoryId} not found.`,
      );
    }

    const { queryParams, ...linkData } = createLinkDto;

    const transaction = await this.prisma.$transaction(async (tx) => {
      const createdLink = await tx.link.create({
        data: {
          ...linkData,
          ownerId: user.id,
        },
      });

      if (queryParams && queryParams.length > 0) {
        const queryParamsWithLinkId = queryParams.map((queryParam) => ({
          ...queryParam,
          linkId: createdLink.id,
          defaultValue:
            queryParam.defaultValue === '' ? null : queryParam.defaultValue,
        }));

        await tx.query_params.createMany({
          data: queryParamsWithLinkId,
        });
      }

      return createdLink;
    });

    return transaction;
  }

  async findUserLinks(userId: number) {
    return await this.prisma.link.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        queryParams: true,
      },
    });
  }

  async findGeneralLinks() {
    return await this.prisma.link.findMany({
      where: {
        isGeneral: true,
      },
      include: {
        queryParams: true,
      },
    });
  }

  async findAllAccessibleLinks(userId: number) {
    return await this.prisma.link.findMany({
      where: {
        OR: [{ ownerId: userId }, { isGeneral: true }],
      },
      include: {
        queryParams: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.link.findMany({
      include: {
        queryParams: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.link.findUnique({
      where: {
        id,
      },
      include: {
        queryParams: true,
      },
    });
  }

  update(id: number, updateLinkDto: UpdateLinkDto) {
    return `This action updates a #${id} link`;
  }

  async remove(id: number, userId: number) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        // Verifique se o link pertence ao usuário
        const link = await tx.link.findUnique({
          where: { id },
          include: { owner: true },
        });

        if (!link) {
          throw new BadRequestException('Link not found');
        }

        if (link.ownerId !== userId) {
          throw new ForbiddenException(
            'You do not have permission to delete this link',
          );
        }

        // Encontre e delete os parâmetros relacionados
        const deletedParams = await tx.query_params.findMany({
          where: {
            linkId: id,
          },
        });

        await tx.query_params.deleteMany({
          where: {
            linkId: id,
          },
        });

        // Delete o link
        const deletedLink = await tx.link.delete({
          where: {
            id,
          },
        });

        return { deletedLink, deletedParams };
      });
    } catch (err) {
      if (err.code === 'P2025') return null;
      throw err;
    }
  }
}
