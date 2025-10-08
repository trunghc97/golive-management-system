package com.golive.mapper;

import com.golive.domain.*;
import com.golive.dto.ChangeDtos.*;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ChangeMapper {
    @Mapping(target = "team", source = "teamName")
    @Mapping(target = "status", expression = "java(change.getStatus().name())")
    @Mapping(target = "conflict", source = "conflictFlag")
    @Mapping(target = "components", expression = "java(toParticipation(change.getComponents()))")
    ChangeResponse toResponse(GoliveChange change);

    default List<ComponentParticipation> toParticipation(List<GoliveComponent> components) {
        return components == null ? List.of() : components.stream().map(gc ->
                new ComponentParticipation(
                        gc.getComponent().getId(),
                        gc.getComponent().getCode(),
                        gc.getComponent().getName(),
                        Boolean.TRUE.equals(gc.getConflictFlag()),
                        gc.getRollbackStatus()
                )
        ).toList();
    }
}


