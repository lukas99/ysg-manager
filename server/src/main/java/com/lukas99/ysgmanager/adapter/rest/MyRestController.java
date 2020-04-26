package com.lukas99.ysgmanager.adapter.rest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1")
public class MyRestController {

  @GetMapping("/application")
  public String getApplicationName() {
    return "ysg-manager";
  }

  @GetMapping("/secure")
  public String getSecure() {
    return "the secret";
  }

}
