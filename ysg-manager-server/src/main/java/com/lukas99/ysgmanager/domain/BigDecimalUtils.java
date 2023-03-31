package com.lukas99.ysgmanager.domain;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Objects;

/**
 * Utility class for BigDecimal operations.
 */
final class BigDecimalUtils {

  private BigDecimalUtils() {
    // holds just static utility methods
  }

  /**
   * Calculates the average of a list of BigDecimals.
   *
   * @param bigDecimals the list of BigDecimal
   * @return the average of the list
   */
  static BigDecimal average(List<BigDecimal> bigDecimals) {
    if (bigDecimals.isEmpty()) {
      // otherwise, division by 0 would not be allowed
      return BigDecimal.ZERO;
    }

    BigDecimal sum = bigDecimals.stream()
        .map(Objects::requireNonNull)
        .reduce(BigDecimal.ZERO, BigDecimal::add);
    return sum.divide(new BigDecimal(bigDecimals.size()), 2, RoundingMode.HALF_UP);
  }

}
