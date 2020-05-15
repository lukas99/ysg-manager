package com.lukas99.ysgmanager.adapter.rest;

import com.lukas99.ysgmanager.Application;
import com.lukas99.ysgmanager.TestSecurityConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.util.TestPropertyValues;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.test.context.ContextConfiguration;
import org.testcontainers.containers.PostgreSQLContainer;

/**
 * Use this class as base class for all integration tests.
 *
 * See:
 *
 * https://dev.to/sivalabs/testing-springboot-applications-4i5p
 *
 * Also see:
 *
 * https://www.baeldung.com/spring-boot-testcontainers-integration-test
 * https://www.testcontainers.org/modules/databases/
 * https://robintegg.com/2019/02/09/testing-spring-boot-applications-with-testcontainers.html
 */
@SpringBootTest(
    webEnvironment = WebEnvironment.RANDOM_PORT,
    classes = {Application.class, TestSecurityConfiguration.class})
@ContextConfiguration(initializers = {IntegrationTest.Initializer.class})
public abstract class IntegrationTest {

  private static PostgreSQLContainer<?> sqlContainer;

  static {
    sqlContainer = new PostgreSQLContainer<>("postgres:11.4");
    sqlContainer.start();
  }

  public static class Initializer
      implements ApplicationContextInitializer<ConfigurableApplicationContext> {
    public void initialize(ConfigurableApplicationContext configurableApplicationContext) {
      TestPropertyValues
          .of("spring.datasource.url=" + sqlContainer.getJdbcUrl(),
              "spring.datasource.username=" + sqlContainer.getUsername(),
              "spring.datasource.password=" + sqlContainer.getPassword())
          .applyTo(configurableApplicationContext.getEnvironment());
    }
  }

}
