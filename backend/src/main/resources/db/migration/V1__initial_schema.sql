-- Go-Live Management System - Initial Schema
-- Version 1: Core tables for systems, services, dependencies, and change requests

-- System table: represents applications/systems that group services
CREATE TABLE system (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    owner_dept VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_system_code ON system(code);

-- Service table: microservices, web apps, mobile apps, batch jobs
CREATE TABLE service (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('MICROSERVICE', 'WEB', 'MOBILE_APP', 'BATCH')),
    system_id BIGINT NOT NULL,
    tech_stack VARCHAR(255),
    git_repo_url VARCHAR(500),
    deploy_pipeline_url VARCHAR(500),
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_service_system FOREIGN KEY (system_id) REFERENCES system(id) ON DELETE CASCADE
);

CREATE INDEX idx_service_code ON service(code);
CREATE INDEX idx_service_system_id ON service(system_id);
CREATE INDEX idx_service_type ON service(type);
CREATE INDEX idx_service_active ON service(active);

-- Service dependency table: tracks dependencies between services
CREATE TABLE service_dependency (
    id BIGSERIAL PRIMARY KEY,
    from_service_id BIGINT NOT NULL,
    to_service_id BIGINT NOT NULL,
    dependency_type VARCHAR(50) NOT NULL DEFAULT 'API',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_dependency_from_service FOREIGN KEY (from_service_id) REFERENCES service(id) ON DELETE CASCADE,
    CONSTRAINT fk_dependency_to_service FOREIGN KEY (to_service_id) REFERENCES service(id) ON DELETE CASCADE,
    CONSTRAINT chk_no_self_dependency CHECK (from_service_id != to_service_id),
    CONSTRAINT uk_service_dependency UNIQUE (from_service_id, to_service_id)
);

CREATE INDEX idx_dependency_from_service ON service_dependency(from_service_id);
CREATE INDEX idx_dependency_to_service ON service_dependency(to_service_id);

-- Change request table: go-live change requests
CREATE TABLE change_request (
    id BIGSERIAL PRIMARY KEY,
    change_code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    system_id BIGINT NOT NULL,
    requester VARCHAR(100) NOT NULL,
    environment VARCHAR(50) NOT NULL DEFAULT 'PRODUCTION',
    planned_start TIMESTAMP NOT NULL,
    planned_end TIMESTAMP NOT NULL,
    actual_start TIMESTAMP,
    actual_end TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ROLLED_BACK')),
    jira_ticket VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_change_system FOREIGN KEY (system_id) REFERENCES system(id) ON DELETE CASCADE,
    CONSTRAINT chk_planned_dates CHECK (planned_end >= planned_start)
);

CREATE INDEX idx_change_code ON change_request(change_code);
CREATE INDEX idx_change_system_id ON change_request(system_id);
CREATE INDEX idx_change_status ON change_request(status);
CREATE INDEX idx_change_planned_start ON change_request(planned_start);
CREATE INDEX idx_change_environment ON change_request(environment);

-- Change service deployment table: service deployments within a change request
CREATE TABLE change_service_deployment (
    id BIGSERIAL PRIMARY KEY,
    change_id BIGINT NOT NULL,
    service_id BIGINT NOT NULL,
    deploy_version VARCHAR(100) NOT NULL,
    config_version VARCHAR(100),
    mr_url VARCHAR(500),
    pipeline_url VARCHAR(500),
    deploy_start TIMESTAMP,
    deploy_end TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'SUCCESS', 'FAILED', 'ROLLED_BACK')),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_deployment_change FOREIGN KEY (change_id) REFERENCES change_request(id) ON DELETE CASCADE,
    CONSTRAINT fk_deployment_service FOREIGN KEY (service_id) REFERENCES service(id) ON DELETE CASCADE,
    CONSTRAINT uk_change_service UNIQUE (change_id, service_id)
);

CREATE INDEX idx_deployment_change_id ON change_service_deployment(change_id);
CREATE INDEX idx_deployment_service_id ON change_service_deployment(service_id);
CREATE INDEX idx_deployment_status ON change_service_deployment(status);
CREATE INDEX idx_deployment_start ON change_service_deployment(deploy_start);

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update timestamp triggers
CREATE TRIGGER update_system_updated_at BEFORE UPDATE ON system FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_updated_at BEFORE UPDATE ON service FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_change_request_updated_at BEFORE UPDATE ON change_request FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_change_service_deployment_updated_at BEFORE UPDATE ON change_service_deployment FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
