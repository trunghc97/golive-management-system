CREATE TABLE IF NOT EXISTS component_master (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS golive_change (
    id BIGSERIAL PRIMARY KEY,
    change_id VARCHAR(50) UNIQUE NOT NULL,
    team_name VARCHAR(100) NOT NULL,
    registered_by VARCHAR(100) NOT NULL,
    description TEXT,
    golive_date DATE NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    rollback_group_id VARCHAR(50),
    conflict_flag BOOLEAN DEFAULT FALSE,
    status VARCHAR(30) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS golive_component (
    id BIGSERIAL PRIMARY KEY,
    change_id BIGINT NOT NULL REFERENCES golive_change(id) ON DELETE CASCADE,
    component_id BIGINT NOT NULL REFERENCES component_master(id),
    conflict_flag BOOLEAN DEFAULT FALSE,
    rollback_flag BOOLEAN DEFAULT FALSE,
    rollback_status VARCHAR(30) DEFAULT 'NONE',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS golive_history (
    id BIGSERIAL PRIMARY KEY,
    change_id BIGINT NOT NULL REFERENCES golive_change(id) ON DELETE CASCADE,
    component_id BIGINT NOT NULL REFERENCES component_master(id),
    action VARCHAR(30) NOT NULL,
    actor VARCHAR(100) NOT NULL,
    action_time TIMESTAMP DEFAULT NOW(),
    notes TEXT
);

CREATE TABLE IF NOT EXISTS rollback_group (
    id BIGSERIAL PRIMARY KEY,
    group_code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_golive_component_change ON golive_component(change_id);
CREATE INDEX IF NOT EXISTS idx_golive_component_component ON golive_component(component_id);
CREATE INDEX IF NOT EXISTS idx_golive_change_start_end ON golive_change(start_time, end_time);


