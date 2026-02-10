# Como Configurar seu Site com Google Sheets

Este site é estático e carrega os dados diretamente de uma planilha do Google Sheets. Siga os passos abaixo para configurar:

## 1. Criar a Planilha
1. Crie uma nova planilha no [Google Sheets](https://sheets.google.com).
2. Nomeie a primeira aba como **Config**.
3. Nomeie a segunda aba como **Services**.

## 2. Estrutura das Abas

### Aba: Config
A primeira linha deve conter os cabeçalhos e a segunda os valores:

| businessName | businessDescription | businessPhone | businessEmail | businessAddress | businessLogo | heroTitle | heroSubtitle | heroButtonText | aboutTitle | aboutDescription | aboutImage | heroImage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Nome da Empresa | Descrição breve | (11) 99999-9999 | contato@email.com | Endereço, Cidade | URL da Logo | Bem-vindo | Subtítulo chamativo | Saiba Mais | Sobre Nós | Texto sobre a empresa | URL da imagem | URL da imagem |

### Aba: Services
A primeira linha deve conter os cabeçalhos e as linhas seguintes os serviços:

| title | description | icon |
| :--- | :--- | :--- |
| Serviço 1 | Descrição do serviço | 🎯 |
| Serviço 2 | Descrição do serviço | ⭐ |

## 3. Publicar na Web
1. Na planilha, vá em **Arquivo > Compartilhar > Publicar na Web**.
2. Clique em **Publicar** e confirme.
3. Copie o **ID da Planilha** da URL do seu navegador.
   - Exemplo de URL: `https://docs.google.com/spreadsheets/d/1A2B3C4D5E6F7G8H9I0J/edit`
   - O ID é: `1A2B3C4D5E6F7G8H9I0J`

## 4. Vincular ao Site
1. Abra o arquivo `script.js`.
2. Na primeira linha, substitua `'YOUR_SHEET_ID_HERE'` pelo seu **ID da Planilha**.
3. Salve o arquivo e seu site estará atualizado com os dados da planilha!

---
**Nota:** Certifique-se de que as URLs das imagens sejam links diretos e públicos.
