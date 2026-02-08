package com.lukas99.ysgmanager;

import java.io.IOException;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

/**
 * Web MVC configuration.
 */
@Configuration
public class MvcConfiguration implements WebMvcConfigurer {

  /**
   * Redirects all requests which are not handled by Spring Boot to index.html allowing Angular to
   * take care of them. Otherwise, trying to access any route other than the root page will result
   * in a Whitelabel Error Page
   * <p>
   * Also see https://keepgrowing.in/java/springboot/make-spring-boot-surrender-routing-control-to-angular/
   *
   * @param registry stores registrations of resource handlers for serving static resources
   */
  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    registry.addResourceHandler("/**")
        .addResourceLocations("classpath:/static/")
        .resourceChain(true)
        .addResolver(new PathResourceResolver() {
          @Override
          protected Resource getResource(String resourcePath, Resource location)
              throws IOException {
            Resource requestedResource = location.createRelative(resourcePath);
            return requestedResource.exists() && requestedResource.isReadable() ? requestedResource
                : new ClassPathResource("/static/index.html");
          }
        });
  }

}
