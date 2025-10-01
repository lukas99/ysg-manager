package com.lukas99.ysgmanager;

import com.google.cloud.spring.autoconfigure.core.GcpContextAutoConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication(
    exclude = {GcpContextAutoConfiguration.class // enabled by GcloudConfiguration if needed
    })
@EnableAsync
public class Application {

  public static void main(String[] args) {
    SpringApplication.run(Application.class, args);
  }

}
