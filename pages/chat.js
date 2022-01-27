import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';

// importar o icone para loading das mensagens
import { ThreeDots } from 'react-loading-icons';
// serviço do banco de dados
import { createClient } from '@supabase/supabase-js'
// usar pra pegar o nome do user logado no index.js passado pelo useRouter
import { useRouter } from 'next/router';
//chave database supabase
const SUPABASE_ANNO_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzI4NjM3NywiZXhwIjoxOTU4ODYyMzc3fQ.obE39FzrzjycEFG25vOG3MC45jDQsPJ5_CKADxG3TyA';
// url
const SUPABASE_URL = 'https://czczddaesnofmtmoqkkr.supabase.co';
// supabase cliente, através dele que é possível pegar dados
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANNO_KEY)
    

export default function ChatPage() {

    // passar para conseguir pegar o nome do user que fez o login
    const router = useRouter();
    const { username } = router.query;

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
                console.log('Dados da consulta: ', data);
                // passar os dados da dataBase para o useState da pag
                if(data != null){
                    setListaMensagens(data)
                }
                setLoading(false)                
            })
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
            .then(({data}) => {
                // pega so a nova mensagem e insere na lista
                setListaMensagens([
                data[0],
                ...listaMensagens
        ]);
            })

        
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
                                    // função pra enviar a msg
                                    handleNovaMensage(mensagem);
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
                                // função pra enviar a msg
                                handleNovaMensage(mensagem);
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat - Queen
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label={'Logout'}
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {

    const handleDeleteMensagem = props.handleDeleteMensagem;

    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow:'auto',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.mensagens.map((mensagem) => {
                // pra cada item do array ele vai retornar:
                return (
                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                    hover: {
                                        transform: 'scale(2.5)',
                                        marginLeft: '20px',
                                        marginRight: '20px'
                                    }
                                }}
                                src={`https://github.com/${mensagem.de}.png`}
                                
                            />
                            <Text tag="strong">
                                {mensagem.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>

                            <Button 
                            /* botão para excluir a mensagem */
                                styleSheet={{
                                    borderRadius: '25%',
                                    width: '12px',
                                    marginLeft: '8px'
                                }}
                                variant='tertiary'
                                colorVariant='dark'
                                label={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>}
                                buttonColors={{
                                    mainColor: appConfig.theme.colors.neutrals['000'],
                                }}
                                // quando clicar vai chamar a função de excluir a mensagem
                                onClick={(event) => {
                                    event.preventDefault()
                                    handleDeleteMensagem(mensagem)
                                }}
                            />

                        </Box>
                        {mensagem.texto}
                    </Text>
                )
            })}

        </Box>
    )
}
