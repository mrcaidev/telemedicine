package com.medical.user.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

/**
 * Knife4j配置类
 */
@Configuration
public class Knife4jConfig {

    /**
     * 配置Knife4j增强功能
     */
    @Bean
    @Primary
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("医疗平台用户服务API")
                        .description("基于Knife4j的医疗平台用户服务接口文档")
                        .version("1.0.0")
                        .license(new License().name("Apache 2.0").url("https://www.apache.org/licenses/LICENSE-2.0.html"))
                        .contact(new Contact()
                                .name("Medical Platform")
                                .email("support@medical.com")
                                .url("https://www.medical.com")))
                .components(new Components()
                        .addSecuritySchemes("JWT认证", 
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("输入JWT令牌")))
                .addSecurityItem(new SecurityRequirement().addList("JWT认证"));
    }
} 