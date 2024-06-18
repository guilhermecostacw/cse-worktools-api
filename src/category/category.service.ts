import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto, userId: number) {
    const data = { ...createCategoryDto, ownerId: userId };
    return await this.prisma.category.create({
      data,
    });
  }

  async findAccessibleCategories(userId: number) {
    return await this.prisma.category.findMany({
      where: {
        OR: [
          { ownerId: userId }, // Categorias onde o usuário é o dono
          {
            // Categorias que têm links gerais
            links: {
              some: {
                isGeneral: true,
              },
            },
          },
          {
            // Categorias que têm links pertencentes ao usuário
            links: {
              some: {
                ownerId: userId,
              },
            },
          },
        ],
      },
    });
  }

  async findAccessibleCategoriesWithLinks(userId: number) {
    return await this.prisma.category.findMany({
      where: {
        OR: [
          // Categorias criadas pelo user
          { ownerId: userId },
          // Categorias que contêm links criados pelo user ou de acesso geral
          {
            links: {
              some: {
                OR: [{ ownerId: userId }, { isGeneral: true }],
              },
            },
          },
        ],
      },
      include: {
        links: {
          // Filtra para incluir apenas links criados pel user ou links de acesso geral
          where: {
            OR: [{ ownerId: userId }, { isGeneral: true }],
          },
          include: {
            queryParams: true, // inclui os query params dos links
          },
        },
      },
    });
  }

  async findAll() {
    return await this.prisma.category.findMany();
  }

  async findCategoryListWithRelatedLinks() {
    return await this.prisma.category.findMany({
      include: {
        links: {
          include: {
            queryParams: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.category.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  async remove(id: number, userId: number) {
    // Step 1: Find the category
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { links: true }, // Include links to check if there are any
    });

    if (!category) {
      throw new BadRequestException('Category Not Found');
    }

    // Step 2: Check if the category belongs to the user
    if (category.ownerId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this category',
      );
    }

    // Step 3: Check if the category has no links
    if (category.links.length > 0) {
      throw new BadRequestException(
        'Cannot delete category with related links',
      );
    }

    // Step 4: Delete the category
    return await this.prisma.category.delete({
      where: { id },
    });
  }

  async isValidCategory(categoryId: number) {
    const category = await this.findOne(categoryId);
    if (!category) {
      throw new BadRequestException('Category Not Found');
    }
    return true;
  }
}
