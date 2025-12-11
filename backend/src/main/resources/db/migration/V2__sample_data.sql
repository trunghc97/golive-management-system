-- Sample data for testing and demonstration

-- Insert sample systems
INSERT INTO system (code, name, owner_dept, description) VALUES
('ECOMMERCE', 'E-Commerce Platform', 'Digital Commerce', 'Main e-commerce platform for online sales'),
('PAYMENT', 'Payment Gateway', 'Finance Technology', 'Payment processing and gateway services'),
('CUSTOMER', 'Customer Management', 'Customer Experience', 'Customer data and profile management'),
('ANALYTICS', 'Analytics Platform', 'Data & Analytics', 'Business intelligence and analytics');

-- Insert sample services
INSERT INTO service (code, name, type, system_id, tech_stack, git_repo_url, deploy_pipeline_url, active) VALUES
-- E-Commerce services
('ecom-web', 'E-Commerce Web Frontend', 'WEB', 1, 'Angular 17, TypeScript', 'https://github.com/company/ecom-web', 'https://jenkins.company.com/ecom-web', true),
('ecom-api', 'E-Commerce API Gateway', 'MICROSERVICE', 1, 'Spring Boot, Java 21', 'https://github.com/company/ecom-api', 'https://jenkins.company.com/ecom-api', true),
('product-service', 'Product Catalog Service', 'MICROSERVICE', 1, 'Spring Boot, Java 21', 'https://github.com/company/product-service', 'https://jenkins.company.com/product-service', true),
('cart-service', 'Shopping Cart Service', 'MICROSERVICE', 1, 'Node.js, Express', 'https://github.com/company/cart-service', 'https://jenkins.company.com/cart-service', true),
('order-service', 'Order Management Service', 'MICROSERVICE', 1, 'Spring Boot, Java 21', 'https://github.com/company/order-service', 'https://jenkins.company.com/order-service', true),

-- Payment services
('payment-gateway', 'Payment Gateway Service', 'MICROSERVICE', 2, 'Spring Boot, Java 21', 'https://github.com/company/payment-gateway', 'https://jenkins.company.com/payment-gateway', true),
('payment-processor', 'Payment Processor', 'MICROSERVICE', 2, 'Go', 'https://github.com/company/payment-processor', 'https://jenkins.company.com/payment-processor', true),
('fraud-detection', 'Fraud Detection Service', 'MICROSERVICE', 2, 'Python, FastAPI', 'https://github.com/company/fraud-detection', 'https://jenkins.company.com/fraud-detection', true),

-- Customer services
('customer-api', 'Customer API', 'MICROSERVICE', 3, 'Spring Boot, Java 21', 'https://github.com/company/customer-api', 'https://jenkins.company.com/customer-api', true),
('customer-mobile', 'Customer Mobile App', 'MOBILE_APP', 3, 'React Native', 'https://github.com/company/customer-mobile', 'https://jenkins.company.com/customer-mobile', true),
('notification-service', 'Notification Service', 'MICROSERVICE', 3, 'Node.js, Express', 'https://github.com/company/notification-service', 'https://jenkins.company.com/notification-service', true),

-- Analytics services
('analytics-api', 'Analytics API', 'MICROSERVICE', 4, 'Spring Boot, Java 21', 'https://github.com/company/analytics-api', 'https://jenkins.company.com/analytics-api', true),
('data-pipeline', 'Data Pipeline Batch', 'BATCH', 4, 'Apache Spark, Scala', 'https://github.com/company/data-pipeline', 'https://jenkins.company.com/data-pipeline', true),
('reporting-service', 'Reporting Service', 'MICROSERVICE', 4, 'Python, FastAPI', 'https://github.com/company/reporting-service', 'https://jenkins.company.com/reporting-service', true);

-- Insert service dependencies
INSERT INTO service_dependency (from_service_id, to_service_id, dependency_type) VALUES
-- E-Commerce dependencies
(1, 2, 'API'),  -- ecom-web -> ecom-api
(2, 3, 'API'),  -- ecom-api -> product-service
(2, 4, 'API'),  -- ecom-api -> cart-service
(2, 5, 'API'),  -- ecom-api -> order-service
(4, 3, 'API'),  -- cart-service -> product-service
(5, 3, 'API'),  -- order-service -> product-service
(5, 6, 'API'),  -- order-service -> payment-gateway

-- Payment dependencies
(6, 7, 'API'),  -- payment-gateway -> payment-processor
(6, 8, 'API'),  -- payment-gateway -> fraud-detection

-- Customer dependencies
(10, 9, 'API'),  -- customer-mobile -> customer-api
(5, 9, 'API'),   -- order-service -> customer-api
(9, 11, 'API'),  -- customer-api -> notification-service
(5, 11, 'API'),  -- order-service -> notification-service

-- Analytics dependencies
(12, 3, 'API'),  -- analytics-api -> product-service
(12, 5, 'API'),  -- analytics-api -> order-service
(12, 9, 'API'),  -- analytics-api -> customer-api
(13, 5, 'DATA'), -- data-pipeline -> order-service
(13, 9, 'DATA'), -- data-pipeline -> customer-api
(14, 12, 'API'); -- reporting-service -> analytics-api

-- Insert sample change requests
INSERT INTO change_request (change_code, title, description, system_id, requester, environment, planned_start, planned_end, status, jira_ticket) VALUES
('CHG-2025-001', 'Q4 Product Catalog Enhancement', 'Add new product filtering and search capabilities', 1, 'john.doe@company.com', 'PRODUCTION', '2025-12-15 02:00:00', '2025-12-15 04:00:00', 'APPROVED', 'JIRA-1234'),
('CHG-2025-002', 'Payment Gateway Security Update', 'Implement PCI-DSS compliance updates', 2, 'jane.smith@company.com', 'PRODUCTION', '2025-12-16 01:00:00', '2025-12-16 03:00:00', 'APPROVED', 'JIRA-1235'),
('CHG-2025-003', 'Customer Mobile App v2.5', 'New customer profile features and UI improvements', 3, 'mike.johnson@company.com', 'PRODUCTION', '2025-12-17 00:00:00', '2025-12-17 02:00:00', 'DRAFT', 'JIRA-1236'),
('CHG-2025-004', 'Analytics Dashboard Upgrade', 'New real-time analytics dashboard', 4, 'sarah.williams@company.com', 'PRODUCTION', '2025-12-18 03:00:00', '2025-12-18 05:00:00', 'DRAFT', 'JIRA-1237'),
('CHG-2025-005', 'Holiday Sale Platform Update', 'Performance optimization for holiday traffic', 1, 'john.doe@company.com', 'PRODUCTION', '2025-12-10 01:00:00', '2025-12-10 03:00:00', 'COMPLETED', 'JIRA-1238');

-- Insert service deployments for change requests
INSERT INTO change_service_deployment (change_id, service_id, deploy_version, config_version, mr_url, pipeline_url, status, notes) VALUES
-- CHG-2025-001 deployments
(1, 3, 'v2.5.0', 'v2.5.0', 'https://github.com/company/product-service/pull/123', 'https://jenkins.company.com/product-service/build/456', 'PENDING', 'New search indexing'),
(1, 2, 'v3.1.0', 'v3.1.0', 'https://github.com/company/ecom-api/pull/89', 'https://jenkins.company.com/ecom-api/build/234', 'PENDING', 'API changes for new filters'),
(1, 1, 'v4.2.0', 'v4.2.0', 'https://github.com/company/ecom-web/pull/67', 'https://jenkins.company.com/ecom-web/build/345', 'PENDING', 'UI for new search features'),

-- CHG-2025-002 deployments
(2, 7, 'v1.8.0', 'v1.8.0', 'https://github.com/company/payment-processor/pull/45', 'https://jenkins.company.com/payment-processor/build/678', 'PENDING', 'PCI-DSS encryption updates'),
(2, 6, 'v2.3.0', 'v2.3.0', 'https://github.com/company/payment-gateway/pull/34', 'https://jenkins.company.com/payment-gateway/build/789', 'PENDING', 'Security patches'),
(2, 8, 'v1.5.0', 'v1.5.0', 'https://github.com/company/fraud-detection/pull/23', 'https://jenkins.company.com/fraud-detection/build/890', 'PENDING', 'Enhanced fraud rules'),

-- CHG-2025-003 deployments
(3, 10, 'v2.5.0', 'v2.5.0', 'https://github.com/company/customer-mobile/pull/78', 'https://jenkins.company.com/customer-mobile/build/901', 'PENDING', 'New profile UI'),
(3, 9, 'v3.0.0', 'v3.0.0', 'https://github.com/company/customer-api/pull/56', 'https://jenkins.company.com/customer-api/build/912', 'PENDING', 'Profile API enhancements'),

-- CHG-2025-004 deployments
(4, 12, 'v2.0.0', 'v2.0.0', 'https://github.com/company/analytics-api/pull/34', 'https://jenkins.company.com/analytics-api/build/923', 'PENDING', 'Real-time data endpoints'),
(4, 14, 'v1.7.0', 'v1.7.0', 'https://github.com/company/reporting-service/pull/29', 'https://jenkins.company.com/reporting-service/build/934', 'PENDING', 'New dashboard widgets'),

-- CHG-2025-005 deployments (completed)
(5, 2, 'v3.0.5', 'v3.0.5', 'https://github.com/company/ecom-api/pull/85', 'https://jenkins.company.com/ecom-api/build/220', 'SUCCESS', 'Performance tuning'),
(5, 4, 'v2.1.3', 'v2.1.3', 'https://github.com/company/cart-service/pull/42', 'https://jenkins.company.com/cart-service/build/231', 'SUCCESS', 'Cache optimization'),
(5, 5, 'v2.8.1', 'v2.8.1', 'https://github.com/company/order-service/pull/67', 'https://jenkins.company.com/order-service/build/242', 'SUCCESS', 'Database query optimization');
