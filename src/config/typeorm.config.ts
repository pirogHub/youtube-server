import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config"

export const getTypeOrmConfig = async (configService: ConfigService): Promise<TypeOrmModuleOptions> => ({
    type: "postgres",
    host: configService.get('DB_HOST') || 'localhost',
    port: configService.get('DB_PORT') || 5432,
    database: configService.get('DB_DATABASE_NAME'),
    username: configService.get('DB_USER'),
    password: configService.get('DB_PASSWORD'),
    autoLoadEntities: true,
    synchronize: true

})