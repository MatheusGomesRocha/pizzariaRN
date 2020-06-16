import React, { useState, useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import uuid from 'uuid/v4';

import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Button,
  Alert,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StatusBar,
} from 'react-native';

import styled from 'styled-components/native';
import lista from './src/lista';
import ListaItem from './src/components/listaItem';
import AddUser from './src/components/addUser';
import AsyncStorage from '@react-native-community/async-storage';
import MainStack from './src/navigators/MainStack';
import MainTab from './src/navigators/MainTab';

/** Div que limita a área de conteúdo nos celulares */
const Div = styled.SafeAreaView` 
  flex: 1;  
  justify-content: center;
  align-items: center;
`;

/** Div de Rolagem */
const DivScroll = styled.ScrollView`
  flex: 1;  
`;

const Flat= styled.FlatList`
`;

const DivView = styled.View`

`;

const ItemCheck = styled.View`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  border: 5px solid #ccc;
  background-color: ${props=>props.status ? '#ccc' : 'transparent'  }
`;

/* Um tipo de View que faz um efeito de opacidade ao clicar em um item e também serve como divScroll*/
const Touch = styled.TouchableHighlight`    
  flex-direction: row;
  height: 50px;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
`;

const Texto = styled.Text`
`;

const Input = styled.TextInput`
  border: 1px solid;
  border-color: transparent;
  border-bottom-color: #000;
  width: 200px;
  height: 40px;
`;

const Btn = styled.Button `

`;

const Img = styled.Image `
  height: 100px;
  width: 100px;
`;

const Box = styled.View `
  flex: 1;
  background-color: rgba(0,0,0,0.5);
  align-items: center;
  justify-content: center;
`;

const BoxBody = styled.View `
  width: 200px;
  height: 200px;
  backgroundColor: #fff;
`;

function nameInput(test) {    /* Exemplo de pegar input com function */
  const [ name, setName] = useState('');     /* state name do campo input*/
  setName(test)
} 

function InputLogin () {
  /* Para mudar o valor de um state, precisamos atribuir esse valor ao setNomeState, e depois podendo pegar com o NomeState */

  const [ name, setName] = useState('');     /* state name do campo input*/
  const [ mostrar, setMostrar] = useState(false);   /* state para mudar na função ao pressionar o botão */
  const [ count, setCount] = useState(0);

  const handleClick = () => {     /* Exemplo que pega se o usuário pressionou o botão */
    if(mostrar) {
      setName('')
      setMostrar(false);
    } else {
      setName(name);
      setMostrar(true);
    }
    
  };

  /* hook é uma adição no react-native que permite usar um state sem precisar escrever uma classe */

  useEffect(()=> {    /* esse hook irá executar uma função (entre {}) toda vez que a constante dentro do array for alterada */
    setCount(count + 1);
  }, [count]);

  return (  /** Exemplo de como seria um mostrar e esconder senha, no caso se o 'mostrar' for true em seguida se for false */
    <DivView>
      <Input value={name} onChangeText={t=>setName(t)}/>    
      <Btn title={mostrar ? 'Ocultar' : 'Mostrar'} onPress={handleClick} /> 

      {mostrar &&
        <Texto> {name} </Texto>
      }
    </DivView>
  );
}

function ImgFunction() {      /** Function para mostrar uma img que está localizada no src/img/ e colocando uma variável para quando estiver carregando e outra pra quando carregar, e um alert pra quando der erro */
  const [status, setStatus] = useState('');

  return (
    <DivView>
      <Img 
        source={{uri:('https://www.google.com.br/google.jpg')}} resizeMode='center' defaultSource={require('./src/img/imgTest.jpg')}
        onLoadStart={() => setStatus('carregando')} 
        onLoadEnd={() => setStatus('carregou')}
        onError={(e) => alert(e.nativeEvent.error)}
      />

      <Texto> {status} </Texto>
    </DivView>
  );
}


function addUserLista ()  {    /** function para mostrar uma lista e adicionar dados dentro de um array que está na lista.js | passa uma prop com paraâmetro na função do AddUser, 
                          faz o tratamento dos dados lá no arquivo addUser.js e na const newItem insere esses dados no array*/
  const [users, setUsers] = useState(lista);

  const newItem = (txt) => {
    let addUser = [...users];
    addUser.push({
      id: uuid(),
      user: txt,
      status: false
    });

    setUsers(addUser);

  }

  /** Flat é abreviação de FlatList que é um tipo de view que economiza a memória do usuário, ou seja, só consome a memória o que está mostrando na tela, e não todo o conteúdo (recomendado em grandes projetos como delivery) */
  return (
      <Div>
        <AddUser onAdd={newItem}/>
        <Flat
        data={users}
        renderItem={({item})=>
        <Touch>
          <Texto> {item.user} - {item.status} </Texto>
        </Touch>
        }
        keyEstractor={(item)=>item.id}
        />
      </Div>
      );
}

function ListaCheck() {   /** Function para mostrar a lista de array no lista.js e marcar como feita ou desfeita */
  const [users, setUsers] = useState(lista);

  function toogleDone (index) {   /** Função de toogle que clona os usuários e faz a troca, se o status do usuário for false, ao clicar troca para true e vice-versa */
      let newIndex = [...users];
      newIndex[index].status = !newIndex[index].status;
      setUsers(newIndex);
  }
  /** passa uma prop no <ItemCheck> para trabalhar com o background de forma dinâmica */
  return (
    <Div>
      <Flat
      data={users}
      renderItem={({item, index})=>
      <Touch underlayColor="#ddd" onPress={() => toogleDone(index)}>
        <>
        <Texto> {item.user} </Texto>
        <ItemCheck status={item.status}></ItemCheck>
        </>
      </Touch>
      }
      keyEstractor={(item)=>item.id}
      />
    </Div>
    );
}

function ListaSwipe () {   /** Function para mostrar a lista de array no lista.js, marcar como feita ou desfeita e deslizar para o lado para deletar ou editar 
                          (o SwipeListView tem as mesmas funções do flat, a unica diferença é que com swipe pode-se deslizar o item para o lado) */
  const [users, setUsers] = useState(lista);

  function toogleDone (index) {   /** Função de toogle que clona a lista de usuários e faz a troca do status, se o status do usuário for false, ao clicar troca para true e vice-versa */
      let newIndex = [...users];
      newIndex[index].status = !newIndex[index].status;
      setUsers(newIndex);
  }

  /** Essa função não funcionou, tentar novamente outro dia */
  /** passa uma prop no <ItemCheck> para usar o background de forma dinâmica */
  return (
      <SwipeListView
        data={users}
        renderItem={({item, index}) => 
        <Touch  onPress={() => toogleDone(index)} activyOpacity={1}>
          <>
          <Texto> {item.user} </Texto>
          <ItemCheck status={item.status}></ItemCheck>
          </>
        </Touch>}
        renderHiddenItem={({item, index}) => <SwipeList></SwipeList>}
        leftOpenValue={50}
      />  
      
    );
}

function Async () {      /** Biblioteca que possibilita salvar informações no própio aparelho (AsyncStorage) */
  const [name, setName] = useState('');
  const [newName, setNewName] = useState('');

  const handleAdd = async () => {   /** Todas as funções que usarem o AsyncStorage precisa acrescentar o Async antes dos () */
    if(newName.trim() != '') {        /** Função para adicionar um valor */
      await AsyncStorage.setItem('name', newName);    /** Para setar um valor a uma variável */
      setName(newName.trim());                        /** Adiciona o valor do input e seta no nome*/
      setNewName('');                                 /** Esvazia o campo de input para o usuário poder digitar novamente */
    } else {
      alert('Digita algo aí men');
    }
  }

  const getName = async () => {     /** Função para pegar esse valor e setar esse valor em uma const */
    const n = await AsyncStorage.getItem('name');
    setName(n);
  }

  useEffect(() => {                 /** Executar a função de pegar o nome ao carregar a página */
    getName();
  }, []);

  return(
    <>
      <Input value={newName}
      onChangeText={n=>setNewName(n)} onSubmitEditing={handleAdd}
      placeholder="Adicione um nome"/>
      <Btn onPress={handleAdd} title="Salvar"/>
      <Touch>
        <Texto> {name} </Texto>
      </Touch>
    </>
  );
}

function Modal1 () {        /** Componente do react-native Modal */
  const [modalVisible, setModalVisible] = useState(false);    /** Inicia com false para o modal começar fechado */

  /** 
   * visible={} retorna a constante criada para setar o valor do modal 
   * animationType="" recebe o tipo de animação que o modal vai aparecer, 'fade', 'slide'
   * transparent={} recebe true se o fundo for transparente, e false se não for transparente
   * onRequestClose={} é só para que os usuários de android, ao clicar na setinha de voltar, o modal feche
  */
  return(
    <>
    <Modal 
      visible={modalVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={()=>setModalVisible(false)}
    >
      <Box>
        <BoxBody>
          <Btn title="fechar" onPress={()=>setModalVisible(false)}/>
        </BoxBody>
      </Box>
      
    </Modal>
    <Btn title="abrir modal" onPress={()=>setModalVisible(true)}/>
    </>
  );
}

function Bar() {      /** Barra de status do aparelho */
  /**
   * barStyle="" recebe a cor do conteúdo
   * backgroundColor="" recebe o background da barra de status (somente para android)
   */
  return (
    <StatusBar barStyle="dark-content" backgroundColor="#fff"/>
  );
}

function App() {    /** Dentro do NavigationContainer fica todo o conteúdo importado do stack ou tab */
  return (
    <NavigationContainer> 
       <MainTab/>
    </NavigationContainer>
  );
}

export default App;
