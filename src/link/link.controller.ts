import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { LinkService } from './link.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateLinkDto } from './dto/update-link.dto';
import { User } from '@prisma/client';

@Controller('link')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createLinkDto: CreateLinkDto, @Req() req: Request) {
    const user: User = req.user as User;
    return await this.linkService.create(createLinkDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user-links')
  async findUserLinks(@Req() req: Request) {
    const user = req.user as User;
    return await this.linkService.findUserLinks(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('general-links')
  async findGeneralLinks() {
    return await this.linkService.findGeneralLinks();
  }

  @UseGuards(JwtAuthGuard)
  @Get('accessible-links')
  async findAllAccessibleLinks(@Req() req: Request) {
    const user = req.user as User;
    return await this.linkService.findAllAccessibleLinks(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return await this.linkService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.linkService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLinkDto: UpdateLinkDto) {
    return this.linkService.update(+id, updateLinkDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as User;
    return this.linkService.remove(+id, user.id);
  }
}
