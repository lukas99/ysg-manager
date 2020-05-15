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
   * take care of them.
   * <p>
   * This is needed for Okta's redirect URL '/implicit/callback' which needs to be handled by
   * Angular and cannot be handled by Spring Boot (otherwise a 404 error occurs when Okta redirects
   * back to our application after user logged in our application runs on port 8080)
   * <p>
   * Also see https://keepgrowing.in/java/springboot/make-spring-boot-surrender-routing-control-to-angular/
   * and https://devforum.okta.com/t/404-response-after-succesfully-logging-in/6188
   *
   * @param registry
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
