import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateOrganizationUseCase } from '../useCases/create-organization-usecase';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '@/shared/decorator/get-decorator';
import { CreateOrganizationDto } from './dtos/create-organiztion.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import baseRoute from '@/config/routes/base-route';

@Controller(`${baseRoute.base_url_v1}/organizations`)
@ApiTags('organization')
export class OrganizationController {
  constructor(
    private readonly createOrganizationUseCase: CreateOrganizationUseCase,
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
}
