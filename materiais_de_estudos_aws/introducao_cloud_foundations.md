# Introdução ao Cloud Foundations - AWS

## 6 Vantagens da Computação em Nuvem

### 1. Trocar despesas de capital por despesas variáveis
Em vez de investir em data centers e servidores antes de saber como vai usá-los, pague apenas quando consumir recursos e somente pelo quanto consumir.

### 2. Beneficiar-se de grandes economias de escala
O uso da computação em nuvem permite obter um custo variável menor do que o que você conseguiria por conta própria. A AWS agrega o uso de centenas de milhares de clientes.

### 3. Parar de adivinhar a capacidade
Elimine as suposições sobre as necessidades de capacidade da infraestrutura. Acesse a quantidade de recursos necessária e aumente ou reduza verticalmente em apenas alguns minutos.

### 4. Aumentar a velocidade e a agilidade
Em um ambiente de computação em nuvem, os novos recursos de TI estão a apenas um clique de distância. O tempo necessário para disponibilizar recursos aos desenvolvedores reduz de semanas para minutos.

### 5. Parar de gastar dinheiro com execução e manutenção de data centers
Concentre-se em projetos que diferenciem seus negócios, em vez de se concentrar na infraestrutura. Delegue instalação em rack, empilhamento e alimentação de servidores ao provedor de nuvem.

### 6. Globalização em minutos
Implante aplicativos em várias Regiões AWS ao redor do mundo com apenas alguns cliques, oferecendo latência mais baixa e melhor experiência aos clientes.

---

## Infraestrutura Global da AWS

### Regiões AWS
- Uma Região da AWS é uma área geográfica física no mundo
- Cada Região é composta por duas ou mais Zonas de Disponibilidade
- A AWS tem 24 regiões ao redor do mundo (em agosto de 2020)
- Os dados NÃO são replicados automaticamente entre Regiões
- Você controla a replicação de dados entre Regiões

### Como escolher uma Região?
1. **Governança de dados e requisitos legais** — leis locais podem exigir que dados fiquem em limites geográficos
2. **Proximidade com os clientes (latência)** — execute na Região mais próxima dos usuários
3. **Serviços disponíveis na Região** — nem todos os serviços estão disponíveis em todas as Regiões
4. **Custos** — variam por Região

### Zonas de Disponibilidade (AZs)
- São data centers ou conjuntos de data centers dentro de uma Região
- Fisicamente separadas entre si
- Cada AZ tem equipamentos próprios: fontes de alimentação, refrigeração, geradores de backup
- Conectadas com baixa latência, alta taxa de transferência e redes redundantes

### Pontos de Presença (Edge Locations)
- 216 locais de pontos de presença (em agosto de 2020)
- 205 locais de borda + 11 caches de borda regionais
- Usados pelo Amazon CloudFront (CDN) e Amazon Route 53 (DNS)
- Reduzem latência ao armazenar conteúdo mais próximo dos usuários

### Recursos da Infraestrutura AWS
- **Elástica e dimensionável**: adapta-se dinamicamente à capacidade necessária
- **Tolerante a falhas**: redundância integrada, continua funcionando mesmo com falhas
- **Alta disponibilidade**: tempo de inatividade mínimo

---

## Categorias de Serviços AWS

### Computação
- Amazon EC2 — servidores virtuais na nuvem
- AWS Lambda — computação serverless
- Amazon ECS — containers Docker
- AWS Elastic Beanstalk — deploy automático PaaS
- AWS Fargate — containers sem gerenciar servidores
- Amazon Lightsail — servidores privados virtuais simples

### Redes e Entrega de Conteúdo
- **Amazon VPC** — provisiona seções logicamente isoladas da AWS Cloud
- **Elastic Load Balancing** — distribui tráfego entre instâncias EC2, containers, IPs e Lambda
- **Amazon CloudFront** — CDN para entrega rápida de conteúdo com baixa latência
- **Amazon Route 53** — serviço DNS escalável, traduz nomes de domínio em IPs
- **AWS Direct Connect** — conexão de rede privada dedicada do data center à AWS
- **AWS VPN** — túnel privado seguro para a rede global da AWS
- **AWS Transit Gateway** — conecta VPCs e redes locais a um único gateway

### Segurança, Identidade e Conformidade
- **AWS IAM** — gerencia acesso aos serviços e recursos da AWS
- **AWS Organizations** — restringe serviços e ações permitidos nas contas
- **Amazon Cognito** — controle de acesso, inscrição e login em aplicativos web/mobile
- **AWS Artifact** — acesso a relatórios de segurança e conformidade
- **AWS KMS** — criação e gerenciamento de chaves de criptografia
- **AWS Shield** — proteção gerenciada contra DDoS

### Gerenciamento de Custos
- **AWS Cost and Usage Report** — dados mais abrangentes de custo e uso
- **AWS Budgets** — define orçamentos e alertas quando custos excedem o valor
- **AWS Cost Explorer** — visualiza e gerencia custos ao longo do tempo

### Gerenciamento e Governança
- **AWS Management Console** — interface web para acessar a conta AWS
- **AWS Config** — rastreia inventário de recursos e alterações de configuração
- **Amazon CloudWatch** — monitora recursos e aplicativos (métricas, logs, alarmes)
- **AWS Auto Scaling** — dimensiona recursos para atender à demanda
- **AWS CLI** — ferramenta unificada para gerenciar serviços via linha de comando
- **AWS Trusted Advisor** — recomendações de desempenho e segurança
- **AWS CloudTrail** — rastreia atividade do usuário e uso de API

---

## Modelo de Responsabilidade Compartilhada

### AWS é responsável pela segurança "DA" nuvem:
- Infraestrutura física (hardware, software, redes, instalações)
- Virtualização
- Segurança física dos data centers
- Hardware de rede e armazenamento

### Cliente é responsável pela segurança "NA" nuvem:
- Sistema operacional das instâncias EC2 (patches e manutenção)
- Aplicativos instalados
- Configuração de Security Groups e firewalls
- Configurações de rede
- Gerenciamento de contas e permissões IAM
- Dados do cliente e criptografia

### Tipos de serviço e responsabilidade:

**IaaS (Ex: EC2, EBS, VPC)**
- Cliente tem mais flexibilidade e controle
- Cliente é responsável por gerenciar mais aspectos de segurança
- Cliente configura controles de acesso, patches de SO, security groups

**PaaS (Ex: Lambda, RDS)**
- AWS gerencia SO, patches de banco de dados, configuração de firewall, DR
- Cliente gerencia apenas dados, classificação de ativos e permissões

**SaaS (Ex: Trusted Advisor, Shield, Amazon Chime)**
- Software hospedado centralmente, acessado por navegador ou API
- Cliente não gerencia a infraestrutura

### Exemplo prático — Quem é responsável?
| Situação | Responsável |
|---|---|
| Patches do SO na instância EC2 | Cliente |
| Segurança física do data center | AWS |
| Infraestrutura de virtualização | AWS |
| Configuração do Security Group do EC2 | Cliente |
| Configuração dos aplicativos na EC2 | Cliente |
| Patches do Oracle no RDS | AWS |
| Patches do Oracle no EC2 | Cliente |
| Configuração de acesso ao bucket S3 | Cliente |

---

## Amazon EC2 (Elastic Compute Cloud)

### O que é?
Servidor virtual seguro e redimensionável na nuvem.
- **Elastic** = aumenta ou reduz número/tamanho de servidores automaticamente
- **Compute** = hospeda aplicativos que exigem CPU e RAM
- **Cloud** = instâncias hospedadas na nuvem AWS

### Casos de uso
- Servidor de aplicativos, web, banco de dados, jogos, e-mail, mídia, arquivos, proxy

### AMI (Amazon Machine Image)
Template para criar instâncias EC2. Contém:
- Sistema operacional (Windows ou Linux)
- Software pré-instalado
- Permissões de execução
- Mapeamento de dispositivo de bloco

**Tipos de AMI:**
- **Início rápido** — AMIs fornecidas pela AWS (Linux e Windows)
- **Minhas AMIs** — AMIs que você criou
- **AWS Marketplace** — modelos pré-configurados de terceiros
- **AMIs da comunidade** — compartilhadas por terceiros (use por sua conta e risco)

### 9 decisões ao criar uma instância EC2:
1. AMI
2. Tipo de instância
3. Definições de rede
4. Função do IAM
5. Dados do usuário
6. Opções de armazenamento
7. Tags
8. Security Group
9. Par de chaves

---

## Amazon S3 (Simple Storage Service)

### O que é?
Serviço de armazenamento de objetos totalmente gerenciado.

### Conceitos fundamentais
- **Bucket** — container principal de armazenamento (associado a uma Região)
- **Objeto** — arquivo armazenado no bucket (composto por dados + metadados)
- **Key** — nome/caminho do objeto dentro do bucket

### URL estrutura
`https://s3-[código-região].amazonaws.com/[nome-bucket]/[objeto]`

### Características
- Armazena dados de forma **redundante em várias instalações** dentro da Região
- **Dimensionamento automático** — sem necessidade de provisionar armazenamento
- **Durabilidade**: 99,999999999% (11 noves)
- Acesso via Console, CLI, SDKs ou endpoints REST (HTTP/HTTPS)

### Casos de uso
- Armazenamento de ativos de aplicativos
- Hospedagem de sites estáticos (HTML, CSS, JavaScript)
- Backup e recuperação de desastres
- Área de preparação para Big Data

### Modelo de preço — O que você PAGA:
- GBs por mês armazenados
- Transferência para FORA para outras Regiões
- Solicitações PUT, COPY, POST, LIST e GET

### Modelo de preço — O que você NÃO PAGA:
- Transferência de dados PARA o Amazon S3 (upload)
- Transferência para fora do S3 para CloudFront ou EC2 na mesma Região

### Estimativa de custos — fatores a considerar:
1. **Classe de armazenamento** — Standard vs Standard-IA
2. **Quantidade de armazenamento** — número e tamanho dos objetos
3. **Tipo de solicitações** — GET tem taxa diferente de PUT/COPY
4. **Transferência de dados** — apenas saída é cobrada

---

## Documentação e Recursos AWS

### Onde encontrar informações oficiais:
- **Documentação da AWS** (docs.aws.amazon.com) — manuais, referências de API, tutoriais
- **AWS Whitepapers** — documentos técnicos recomendados para o exame:
  - Visão geral da Amazon Web Services
  - Architecting for the Cloud: AWS Best Practices
  - How AWS Pricing Works
  - The Total Cost of (Non) Ownership of Web Applications in the Cloud

### Lambda suporta as linguagens:
Node.js, Java, C#, Python, Ruby, Go e PowerShell

### Serviços Globais vs Regionais:
- **Globais**: IAM, Route 53
- **Regionais**: EC2, Lambda, VPC, S3

### Sub-redes e VPCs:
- **Sub-redes** existem no nível da **Zona de Disponibilidade**
- **VPCs** existem no nível da **Região**

### IAM está na categoria de serviço:
Segurança, Identidade e Conformidade

### Amazon VPC está na categoria de serviço:
Redes e Entrega de Conteúdo

---

## Custo Total de Propriedade (TCO)

### O que é TCO?
Estimativa financeira para identificar custos diretos e indiretos de um sistema.

### Uso do TCO:
- Comparar custos de execução no local vs nuvem AWS
- Fazer orçamento e desenvolver caso de negócio para migração

### Custos no local incluem:
- Hardware (servidores, armazenamento, rede)
- Software (SO, licenças de virtualização)
- Instalações (espaço, energia, refrigeração)
- Mão de obra de TI

### Calculadora de Preço da AWS:
- Acesse: https://calculator.aws
- Estima custos mensais
- Identifica oportunidades de redução de custos
- Compara modelos de implantação

### Serviços AWS que NÃO têm cobrança direta:
- Amazon VPC
- AWS Elastic Beanstalk
- AWS CloudFormation
- IAM
- Amazon EC2 Auto Scaling
- AWS OpsWorks
- Cobrança consolidada

⚠️ Atenção: os RECURSOS provisionados por esses serviços podem ter custo!

### Regras de transferência de dados:
- Transferência de dados de ENTRADA: gratuita
- Transferência entre serviços na mesma Região: gratuita
- Transferência de dados de SAÍDA: paga (definida em camadas)
