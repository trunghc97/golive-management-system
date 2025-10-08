INSERT INTO component_master (code, name, type)
VALUES
 ('ms-transfer', 'Transfer Service', 'microservice'),
 ('ms-payment', 'Payment Service', 'microservice'),
 ('web-portal', 'Customer Portal', 'web'),
 ('job-statement', 'Statement Batch', 'job')
ON CONFLICT (code) DO NOTHING;


