INSERT INTO component_master (code, name, type)
VALUES
 ('ms-transfer', 'Transfer Service', 'microservice'),
 ('ms-payment', 'Payment Service', 'microservice'),
 ('web-portal', 'Customer Portal', 'web'),
 ('job-statement', 'Statement Batch', 'job'),
 ('ms01', 'Microservice 01', 'microservice'),
 ('ms02', 'Microservice 02', 'microservice'),
 ('ms03', 'Microservice 03', 'microservice'),
 ('ms04', 'Microservice 04', 'microservice'),
 ('ms05', 'Microservice 05', 'microservice'),
 ('ms06', 'Microservice 06', 'microservice'),
 ('ms07', 'Microservice 07', 'microservice'),
 ('ms08', 'Microservice 08', 'microservice'),
 ('ms09', 'Microservice 09', 'microservice'),
 ('ms10', 'Microservice 10', 'microservice')
ON CONFLICT (code) DO NOTHING;


