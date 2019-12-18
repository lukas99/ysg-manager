package com.lukas99.ysgmanager;

import org.junit.ClassRule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.util.TestPropertyValues;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.testcontainers.containers.PostgreSQLContainer;

/**
 * See:
 * <p>
 * https://www.baeldung.com/spring-boot-testcontainers-integration-test
 * https://www.testcontainers.org/modules/databases/
 * https://robintegg.com/2019/02/09/testing-spring-boot-applications-with-testcontainers.html
 */
@RunWith(SpringRunner.class)
@SpringBootTest
@ContextConfiguration(initializers = {ApplicationTests.Initializer.class})
public class ApplicationTests {

  @ClassRule
  public static PostgreSQLContainer<?> dbContainer = new PostgreSQLContainer<>("postgres:11.4");

  @Test
  public void contextLoads() {}

  static class Initializer
      implements ApplicationContextInitializer<ConfigurableApplicationContext> {
    @Override
    public void initialize(ConfigurableApplicationContext configurableApplicationContext) {
      TestPropertyValues
          .of("spring.datasource.url=" + dbContainer.getJdbcUrl(),
              "spring.datasource.username=" + dbContainer.getUsername(),
              "spring.datasource.password=" + dbContainer.getPassword())
          .applyTo(configurableApplicationContext.getEnvironment());
    }
  }

}
