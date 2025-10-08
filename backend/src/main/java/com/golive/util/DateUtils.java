package com.golive.util;

import java.time.LocalDate;
import java.time.LocalDateTime;

public final class DateUtils {
    private DateUtils() {}

    public static LocalDateTime[] getLogicalDayRange(LocalDate date) {
        LocalDateTime start = date.minusDays(1).atTime(18, 0);
        LocalDateTime end = date.atTime(5, 0);
        return new LocalDateTime[]{start, end};
    }
}


