import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateOrganizationUseCase } from '../useCases/create-organization-usecase';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '@/shared/decorator/get-decorator';
import { CreateOrganizationDto } from './dtos/create-organiztion.dto';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import baseRoute from '@/config/routes/base-route';
import { FindOrganizationUseCase } from '../useCases/find-organization-usecase';
import { ListOrganizationUseCase } from '../useCases/list-organization-usecase';
import { DisableOrganizationUseCase } from '../useCases/disable-organization-usecase';
import { UpdateOrganizationUseCase } from '../useCases/update-organization-usecase';
import { UpdateOrganizationDto } from './dtos/update-organiztion.dto';

@Controller(`${baseRoute.base_url_v1}/organizations`)
@ApiTags('organization')
export class OrganizationController {
  constructor(
    private readonly createOrganizationUseCase: CreateOrganizationUseCase,
    private readonly findOrganizationUseCase: FindOrganizationUseCase,
    private readonly listOrganizationUseCase: ListOrganizationUseCase,
    private readonly disableOrganizationUseCase: DisableOrganizationUseCase,
    private readonly updateOrganizationUseCase: UpdateOrganizationUseCase,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: 201,
    description: 'Organization created',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: 'uuid',
        },
        name: {
          type: 'string',
          example: 'Organization name',
        },
        description: {
          type: 'string',
          example: 'Organization description',
        },
        accountId: {
          type: 'string',
          example: 'uuid',
        },
        createdBy: {
          type: 'string',
          example: 'uuid',
        },
        createdAt: {
          type: 'string',
          example: '2021-02-25T14:47:44.000Z',
        },
        updatedAt: {
          type: 'string',
          example: '2021-02-25T14:47:44.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 400,
        },
        message: {
          type: 'string',
          example: 'Organization already exists',
        },
        error: {
          type: 'string',
          example: 'Bad Request',
        },
      },
    },
  })
  async create(
    @GetUser() user: any,
    @Body() createOrganizationDto: CreateOrganizationDto,
  ) {
    const { name, description } = createOrganizationDto;
    return this.createOrganizationUseCase.execute({
      name,
      accountId: user.accountId,
      createdBy: user.id,
      description,
    });
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'id',
    type: 'string',
    example: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Organization found',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: 'uuid',
        },
        name: {
          type: 'string',
          example: 'Organization name',
        },
        description: {
          type: 'string',
          example: 'Organization description',
        },
        accountId: {
          type: 'string',
          example: 'uuid',
        },
        createdBy: {
          type: 'string',
          example: 'uuid',
        },
        createdAt: {
          type: 'string',
          example: '2021-02-25T14:47:44.000Z',
        },
        updatedAt: {
          type: 'string',
          example: '2021-02-25T14:47:44.000Z',
        },
      },
    },
  })
  async details(@GetUser() user: any, @Param('id') id: string) {
    return await this.findOrganizationUseCase.execute({
      accountId: user.accountId,
      organizationId: id,
      userId: user.id,
    });
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: 200,
    description: 'Organization list',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: 'uuid',
          },
          name: {
            type: 'string',
            example: 'Organization name',
          },
          description: {
            type: 'string',
            example: 'Organization description',
          },
          accountId: {
            type: 'string',
            example: 'uuid',
          },
          createdBy: {
            type: 'string',
            example: 'uuid',
          },
          createdAt: {
            type: 'string',
            example: '2021-02-25T14:47:44.000Z',
          },
          updatedAt: {
            type: 'string',
            example: '2021-02-25T14:47:44.000Z',
          },
        },
      },
    },
  })
  async list(@GetUser() user: any) {
    return await this.listOrganizationUseCase.execute({
      accountId: user.accountId,
      userId: user.id,
    });
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'id',
    type: 'string',
    example: 'uuid',
  })
  async disable(@GetUser() user: any, @Param('id') id: string) {
    await this.disableOrganizationUseCase.execute({
      accountId: user.accountId,
      organizationId: id,
      userId: user.id,
    });
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'id',
    type: 'string',
    example: 'uuid',
  })
  async update(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() createOrganizationDto: UpdateOrganizationDto,
  ) {
    const { name, description } = createOrganizationDto;
    return this.updateOrganizationUseCase.execute({
      name,
      accountId: user.accountId,
      description,
      userId: user.id,
      organizationId: id,
    });
  }
}
