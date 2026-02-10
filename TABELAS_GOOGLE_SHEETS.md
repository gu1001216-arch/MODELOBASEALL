# Estrutura das Tabelas para o Google Sheets

Para que o site funcione corretamente, você deve criar uma planilha no Google Sheets com duas abas (página 1 e página 2) exatamente com os nomes e colunas abaixo.

---

## 1ª Aba: Nomeie como `Config`

Esta aba controla as informações gerais do seu site. A primeira linha deve conter os nomes das colunas (em inglês, como o sistema lê), e a segunda linha os seus dados.

| businessName | businessDescription | businessPhone | businessEmail | businessAddress | businessLogo | heroTitle | heroSubtitle | heroButtonText | aboutTitle | aboutDescription | aboutImage | heroImage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Nome da sua Empresa | Uma breve descrição do que você faz | (11) 99999-9999 | contato@seuemail.com | Rua Exemplo, 123 - São Paulo/SP | URL da sua Logo (opcional) | Bem-vindo ao Nosso Site | Oferecemos as melhores soluções para você | Saiba Mais | Sobre Nós | Conte aqui a história da sua empresa e seus valores | URL de uma imagem sobre a empresa | URL da imagem de fundo do topo |

---

## 2ª Aba: Nomeie como `Services`

Esta aba lista os serviços que aparecerão no site. Cada linha após o cabeçalho será um novo card de serviço.

| title | description | icon |
| :--- | :--- | :--- |
| Consultoria Estratégica | Ajudamos sua empresa a crescer com planos personalizados. | 🎯 |
| Suporte Técnico | Atendimento rápido e eficiente para seus problemas tecnológicos. | 🛠️ |
| Marketing Digital | Aumente sua presença online e conquiste novos clientes. | 🚀 |
| Design Criativo | Identidade visual e artes que destacam sua marca. | 🎨 |

---

## Dicas Importantes:

1.  **Nomes das Colunas:** Não altere os nomes das colunas na primeira linha (ex: `businessName`, `title`), pois o código do site procura exatamente por esses termos.
2.  **Emojis:** Você pode usar emojis na coluna `icon` da aba de serviços para dar um visual moderno.
3.  **URLs de Imagem:** Para as colunas de imagem (`aboutImage`, `heroImage`, `businessLogo`), use links diretos de imagens hospedadas na internet (ex: links do Google Drive compartilhados publicamente ou sites de hospedagem de imagem).
4.  **Publicação:** Lembre-se de ir em **Arquivo > Compartilhar > Publicar na Web** para que o site consiga ler os dados.
