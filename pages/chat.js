import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';

// importar o icone para loading das mensagens
import { ThreeDots } from 'react-loading-icons';
// serviço do banco de dados
import { createClient } from '@supabase/supabase-js';
// usar pra pegar o nome do user logado no index.js passado pelo useRouter
import { useRouter } from 'next/router';
// importando componente criado
import { Header } from '../src/components/header';
import { ButtonSendSticker } from '../src/components/buttonSendSticker';
import { MessageList } from '../src/components/messageList';

import {SUPABASE_ANNO_KEY, SUPABASE_URL} from "../src/services/db";

// supabase cliente, através dele que é possível pegar dados
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANNO_KEY);
    
// função para atualizar a lista quando houver novo submissão no supabase
function messagesRealTime(adicionaMensagem) {
    return supabaseClient
        .from('mensagens')
        .on('INSERT', (resposta) => {
            adicionaMensagem(resposta.new);
        })
        .subscribe()
}

export default function ChatPage() {

    // passar para conseguir pegar o nome do user que fez o login
    const roteamento = useRouter();
    const { username } = roteamento.query;

    // useState para manter a mensagem
    const [mensagem, setMensagem] = React.useState('');
    // lista de mensagens
    const [listaMensagens, setListaMensagens] = React.useState([]);

    // useState para o loading
    const [loading, setLoading] = React.useState(true)

    

    // "não faz parte do fluxo padrão"
    // usando ele com o supabase para não fazer uma requisição sempre que renderizar o chatPage
    // se não fosse, toda vez que uma tecla fosse digitada ele faria uma requisição.
    // toda vez que a página carregar ele roda
    React.useEffect(() => {
        // Pegar os dados do database
        supabaseClient
            .from('mensagens')
            .select('*')
            .order('id', {ascending: false}) // mudar a ordem do id, maoir para o menor e vir na ordem que queremos
            .then(({data}) => {
                // console.log('Dados da consulta: ', data);
                // passar os dados da dataBase para o useState da pag
                if(data != null){
                    setListaMensagens(data)
                }
                setLoading(false)                
            })
        
        messagesRealTime((novaMensagem) => {
            // console.log('Nova mensagem: ', novaMensagem)
            // ele que seta a nova mensagem na lista do use state
            // pega so a nova mensagem e insere na lista
            setListaMensagens((valorAtualLista) => {
                // se não for com a funcçao, ele não pega o valor atualizado da lista
                return [
                    novaMensagem,
                    ...valorAtualLista
                    ]
            });
        });

    }, []) // [condição que faz ele chamar o useEffect dnv]
    


    // função pra enviar as mensagens
    function handleNovaMensage(novaMensagem) {
        // props da mensagem
        const mensagem = {
            // id já tem la no servidor, ai não precisa
            de: username,
            texto: novaMensagem,
        }

        // Enviar a nova mensagem para o database 
        supabaseClient
            .from('mensagens')
            .insert([mensagem])
            .then()

        setMensagem('');
    }

    // função para deletar mensagem da lista
    function handleDeleteMensagem(mensagemAtual) {
        
        // excluir a mensagem primeiro no supabase e depois no useState 
        supabaseClient
            .from('mensagens')
            .delete()
            .match({id: mensagemAtual.id})
            .then(({data}) => {
                // lista filtrada
                const messagesListFiltered = listaMensagens.filter((message) => {
                    return message.id != data[0].id
                });
                setListaMensagens(messagesListFiltered);
            });

        
    }
    

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundImage: `url(https://www.wallpapertip.com/wmimgs/69-697483_bohemian-rhapsody-queen-music-movies-bohemian-rhapsody-wallpaper.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >
                    {loading ? 
                        <Box
                            styleSheet={{
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%'
                            }}
                        >
                            <ThreeDots 
                                fill={appConfig.theme.colors.neutrals[800]} 
                                height='16px'
                            />
                        </Box>
                        :
                        <MessageList mensagens={listaMensagens} handleDeleteMensagem={handleDeleteMensagem}/>
                    
                    }
                    
                
                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            flexDirection: 'row',
                        }}
                    >
                        
                        <TextField
                            value={mensagem}
                            onChange={(event) => {
                                const valor = event.target.value;
                                setMensagem(valor)
                            }}
                            // para verificar se o enter vai ser pressionado
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    // retirar o comportamento padrão do enter (quebrar uma linha)
                                    event.preventDefault();
                                    if (mensagem != ''){
                                        // função pra enviar a msg
                                    handleNovaMensage(mensagem);
                                    }
                                    
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '6px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        <ButtonSendSticker 
                            // recebe a url do sticker clicado
                            // "callback"
                            onStickerClick={(sticker) => {
                                // console.log('salva esse sticker no db', sticker);
                                handleNovaMensage(':sticker: ' + sticker)
                            }}
                        />
                        <Button 
                            size="lg"
                            variant='primary'
                            colorVariant = 'dark'
                            label={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-send"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>}
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals["000"],
                                mainColor: appConfig.theme.colors.neutrals[800],
                                mainColorLight: appConfig.theme.colors.neutrals[900],
                                mainColorStrong: appConfig.theme.colors.neutrals[900],
                            }}
                            styleSheet={{
                                borderRadius:'5px'
                            }}
                            onClick={(event) => {
                                // retirar o comportamento padrão do enter (quebrar uma linha)
                                event.preventDefault();
                                if (mensagem != ''){
                                    // função pra enviar a msg
                                handleNovaMensage(mensagem);
                                }
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
