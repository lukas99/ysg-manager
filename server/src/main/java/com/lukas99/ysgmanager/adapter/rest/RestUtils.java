package com.lukas99.ysgmanager.adapter.rest;

import java.net.URI;
import org.springframework.hateoas.Link;

/**
 * Provides utility methods for REST controllers.
 */
final class RestUtils {

  private RestUtils() {
    // utility class only with static methods
  }

  /**
   * @param link The link from which the last path segment should be retrieved.
   * @return The last segment of the uri of the given link.
   */
  static Long getLastPathSegment(Link link) {
    var uri = URI.create(link.getHref());
    var segments = uri.getPath().split("/");
    var lastSegment = segments[segments.length - 1];
    return Long.parseLong(lastSegment);
  }

}
