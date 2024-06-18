import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from '@prisma/client';
import { Request } from 'express';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto, @Req() req: Request) {
    const user: User = req.user as User;

    return this.categoryService.create(createCategoryDto, user.id);
  }

  // Para mostrar as categorias onde faz sentido para o user criar links
  @UseGuards(JwtAuthGuard)
  @Get('accessible')
  async findAccessibleCategories(@Req() req: Request) {
    const user: User = req.user as User;
    return await this.categoryService.findAccessibleCategories(user.id);
  }

  // Para mostrar links na aba lateral
  @UseGuards(JwtAuthGuard)
  @Get('accessible-with-links')
  async findAccessibleCategoriesWithLinks(@Req() req: Request) {
    const user: User = req.user as User;
    return await this.categoryService.findAccessibleCategoriesWithLinks(
      user.id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query('includeLinks') includeLinks: string) {
    if (includeLinks === 'true') {
      return await this.categoryService.findCategoryListWithRelatedLinks();
    }
    return await this.categoryService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoryService.findOne(+id);

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const user: User = req.user as User;
    const removedCategory = await this.categoryService.remove(id, user.id);

    if (!removedCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return removedCategory;
  }
}
