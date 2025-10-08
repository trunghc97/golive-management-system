package com.golive.dto;

public class ComponentDtos {
    public record ComponentItem(Long id, String code, String name, String type, boolean active) {}
}


