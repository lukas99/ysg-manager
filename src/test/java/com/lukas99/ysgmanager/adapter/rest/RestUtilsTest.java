package com.lukas99.ysgmanager.adapter.rest;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.hateoas.Link;

class RestUtilsTest {

  @Test
  void getLastPathSegment() {
    var link = new Link("http://example.com/foo/bar/42", "self");
    var lastPathSegment = RestUtils.getLastPathSegment(link);
    assertThat(lastPathSegment, is(42L));
  }

  @Test
  void getLastPathSegment_uriWithQueryParameters() {
    var link = new Link("http://example.com/foo/bar/42?param=true", "self");
    var lastPathSegment = RestUtils.getLastPathSegment(link);
    assertThat(lastPathSegment, is(42L));
  }

}