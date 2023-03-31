package com.lukas99.ysgmanager.domain;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.Test;

class BigDecimalUtilsTest {

  @Test
  void average_withoutRounding() {
    var bigDecimals = List.of(BigDecimal.TEN, BigDecimal.TEN);
    assertThat(BigDecimalUtils.average(bigDecimals)).isEqualTo(new BigDecimal("10.00"));
  }

  @Test
  void average_withRoundingDown() {
    var bigDecimals = List.of(new BigDecimal("81"), new BigDecimal("91"), new BigDecimal("84"));
    assertThat(BigDecimalUtils.average(bigDecimals)).isEqualTo(new BigDecimal("85.33"));
  }

  @Test
  void average_withRoundingUp() {
    var bigDecimals = List.of(new BigDecimal("82"), new BigDecimal("91"), new BigDecimal("84"));
    assertThat(BigDecimalUtils.average(bigDecimals)).isEqualTo(new BigDecimal("85.67"));
  }

  @Test
  void average_emptyList() {
    assertThat(BigDecimalUtils.average(List.of())).isEqualTo(new BigDecimal("0"));
  }

}
