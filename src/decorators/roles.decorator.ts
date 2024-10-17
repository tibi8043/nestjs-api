import { Reflector } from '@nestjs/core';
import { ROLES } from 'src/constans/roles';

export const Roles = Reflector.createDecorator<ROLES[]>();
