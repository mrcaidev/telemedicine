package com.medical.gateway.config;

import org.springdoc.core.properties.SwaggerUiConfigParameters;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cloud.gateway.route.RouteDefinition;
import org.springframework.cloud.gateway.route.RouteDefinitionLocator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    @Lazy(false)
    public List<String> apis(SwaggerUiConfigParameters swaggerUiConfigParameters,
                           RouteDefinitionLocator locator) {
        List<String> groups = new ArrayList<>();
        List<RouteDefinition> definitions = locator.getRouteDefinitions().collectList().block();
        if (definitions != null) {
            definitions.stream().filter(routeDefinition -> routeDefinition.getId().matches("medical-.*"))
                    .forEach(routeDefinition -> {
                        String name = routeDefinition.getId();
                        groups.add(name);
                        swaggerUiConfigParameters.addGroup(name);
                    });
        }
        return groups;
    }
} 