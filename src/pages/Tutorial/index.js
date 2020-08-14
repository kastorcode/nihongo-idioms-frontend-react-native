import React, { useState, useEffect } from 'react';
import { withTheme } from 'styled-components';
import { FlatList } from 'react-native';
import Background from '../../components/Background';
import Container from '../../components/Container';
import Header from '../../components/Header';
import Title from '../../components/Title';
import Topic from '../../components/Topic';
import { ListContainerStyled } from './style';

function Tutorial({ route, theme }) {
	const [topic, setTopic] = useState(route.params.topic);

	const [topics] = useState([
		{ topic: 'study', icon: false, title:'Como estudar na plataforma da Nihongo?', text: 'Ao entrar na nossa plataforma, o primeiro passo é acessar a seção Módulos. Lá existem vários tópicos, onde cada um possui uma pequena explicação e várias frases pra você adicionar ao seu vocabulário. Cada explicação serve para te ajudar no entendimento do idioma, e você pode escolher quais frases você quer memorizar, basta ir clicando sobre cada uma.\n\nApós adicionar as frases de um módulo ao seu vocabulário, o próximo passo é acessar o recurso Vocabulário e começar a revisar as suas frases para aprendê-las. Você pode revisar também conteúdo aleatório, do dia anterior ou seguinte.\n\nO recurso Vocabulário não te deixará fluente, como o nome sugere, ele serve para você aprender palavras e saber como ultilizá-las, serve para você memorizá-las e não se esquecer. Aí entra o Shadowing, este recurso é a combinação de texto mais áudio, ele é quem fará você conseguir se expressar com fluência. Você deve estudá-lo da seguinte forma: primeiro, leia o texto até compreendê-lo 100%, segundo, escute o áudio e o acompanhe fazendo a leitura, terceiro, escute o áudio sem nenhum tipo de auxílio até entendê-lo perfeitamente. Lembre-se que é necessário repetir várias vezes até o aprendizado, depois passe para um outro texto.\n\nSurgiu alguma dúvida? Procure no Fórum a resposta que procura, caso não a encontre, faça uma pergunta e aguarde as respostas dos outros usuários.\n\nPara entrar em contato conosco, utilize o fórum de sugestões ou bugs.' },
		{ topic: 'vocabulary', icon: false, title: 'Como usar o recurso Vocabulário?', text: 'O recurso Vocabulário serve pra você construir o seu... vocabulaŕio! Você deve utilizá-lo para revisar suas frases todos os dias, uma só vez já é suficiente, mas deve ter constância. Ao adicionar uma frase, você vai revisá-la cinco dias seguidos, depois uma vez por semana durante cinco semanas, depois a repetição espaçada vai aumentando em 30 dias, de acordo com estudos científicos, é necessário ter contato com uma palavra de 15 a 20 vezes para aprendê-la.\n\nTambém é possível treinar frases revisadas hoje, ontem, amanhã ou aleatoriamente, o treinamento não influencia no fluxo de revisões. É recomendado que você escute cada áudio 5 vezes, use a página de configurações para ajustar do jeito que preferir. Se você clicar em Ok, a repetição segue seu fluxo normal, se clicar em Amanhã, irá revisá-la no dia seguinte e volta-se um passo. Você pode adicionar suas próprias frases, procurar frases adicionadas por outras pessoas e na página Minhas Frases, gerenciá-las.\n\nTeclas de atalho: seta para cima ou W clica em Mostrar Resposta, seta esquerda ou A clica em Repetir, seta para baixo ou S clica em Amanhã, seta direita ou D clica em Ok, tecla de espaço ou P reproduz áudio.' },
		{ topic: 'shadowing', icon: false, title: 'Como usar o recurso Shadowing?', text: 'O recurso Shadowing é a combinação de texto + áudio, é ele quem te deixará fluente no idioma, forçando seu listening e seu reading. Após a construção de um pequeno vocabulário, você deve começar a usar esta técnica para ir avançando de nível no idioma, estude-a da seguinte maneira: primeiro, leia o texto (na mente e também em voz alta) até compreendê-lo 100%, segundo, ouça o áudio e o acompanhe fazendo a leitura até entender o áudio também, terceiro, ouça o áudio isoladamente, sem nenhum tipo de auxílio até entendê-lo. Lembre-se que é necessário repetir várias vezes até aprender, se aparecer alguma palavra que você não conhece, clique sobre ela para ver seu significado, procure em dicionários e não se esqueça que você também pode adicionar uma frase com esta palavra ao seu vocabulário para repeti-la e aprendê-la.\n\nTeclas de atalho: tecla de espaço ou P reproduz áudio, tecla enter ou C ativa/desativa legendas.' },
		{ topic: 'modules', icon: false, title: 'O que são os Módulos?', text: 'Os Módulos são a sua fonte primária de conhecimento dentro da plataforma. Cada módulo trata de um assunto específico, com uma pequena explicação que vai te auxiliando pelo caminho e várias frases pra você adicionar ao seu vocabulário. Recomendamos que você estude de 1 a 2 módulos por semana, e uma revisão do módulo um mês após o seu estudo. Cuidado para não estudar módulos demais e adicionar muitas frases de uma só vez ao seu vocabulário, conteúdo em excesso satura sua mente e prejudica seu progresso.' },
		{ topic: 'change', icon: false, title: 'Como eu mudo de curso?', text: 'Clique na logo e vá para a página principal, lá existe um campo com o título Curso que lista todos os cursos que você adicionou.' },
		{ topic: 'add', icon: false, title: 'Como eu adiciono um curso?', text: 'Acesse: menu > configurações > adicionar curso, escolha um dentre as opções.' },
		{ topic: 'premium', icon: 'smile', title: 'O que é uma conta Premium?', text: 'Com uma conta premium você pode remover os anúncios da plataforma e utilizar o app mobile sem uma conexão com a internet, cada pagamento tem um prazo de um ano. O pagamento é processado pela plataforma Hotmart e você tem um prazo de 7 dias para pedir reembolso. Sinta-se livre em se juntar a nós, vamos juntos construir a comunidade definitiva no aprendizado de idiomas e desenvolvimento pessoal, você apoia a educação gratuita, ajuda a manter a Nihongo no ar e da suporte ao desenvolvedor.' },
		{ topic: 'course', icon: false, title: 'Posso criar um curso para a plataforma?', text: 'Sim! Se você tem algum conhecimento em um idioma e gostaria de contribuir com a comunidade sinta-se livre! Para criar um curso para a Nihongo use a seguinte metodologia:\n\nPrimeiro, pegue as 1000 palavras mais utilizadas do idioma.\n\nSegundo, pegue 1000 frases em todos os tempos verbais (passado, presente e futuro) que façam uso destas palavras.\n\nTerceiro, organize todas elas em 26 módulos, cada um com um assunto diferente, cada módulo deve ser estudado a cada semana, totalizando um treinamento de 6 meses.\n\nQuarto, crie uma explicação para cada módulo, é um complemento que auxilia o entendimento do aluno.\n\nQuinto, pegue pelo menos 30 textos com áudio para o shadowing, 10 de nível básico, 10 de nível intermediário e 10 de nível avançado.\n\nSexto, faça a tradução destes textos para que o aluno tenha uma legenda para acompanhar.\n\nSétimo, entre em contato pelo fórum de sugestões, nós teremos o maior prazer em publicar o seu curso.' },
		{ topic: 'contact', icon: false, title: 'Como entrar em contato?', text: 'Em nosso Fórum temos dois tópicos especiais onde os alunos podem entrar em contato direto conosco, use o fórum de sugestões e o de bugs para propor mudanças, relatar problemas e ademais assuntos.' }
	]);

	useEffect(() => {
		setTopic(route.params.topic);
	}, [route.params.topic]);

	return (
		<Background>
			<Header />

			<Container scroll={true}>
				<Title>Página de Ajuda</Title>

				<ListContainerStyled>
					<FlatList
		        data={topics}
		        extraData={topic}
		        keyExtractor={item => item.topic}
		        renderItem={({item}) => (
		        	<Topic
		        		title={item.title}
		        		text={item.text}
		        		icon={item.icon}
		        		topic={item.topic}
		        		route={topic}
		        	/>
		        )}
			    />
				</ListContainerStyled>
			</Container>
		</Background>
	);
}

export default withTheme(Tutorial);