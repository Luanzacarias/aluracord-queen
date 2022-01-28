
import { Box, Text, Image, Button } from "@skynexui/components";
import appConfig from "../../config.json";

import { apiGithub, gitURL } from '../services/api';



export function MessageList(props) {

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
                                src={`${gitURL}${mensagem.de}.png`}
                                
                            />
                            <Text tag="strong">
                                <a
                                    href={`${gitURL}${mensagem.de}`}
                                    style={{
                                        textDecoration: 'none',
                                        color: "inherit"
                                    }}
                                    target={"_blank"}
                                >
                                    {mensagem.de}
                                </a>
                                
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
                                    marginLeft: '8px',
                                    hover:{
                                        color: appConfig.theme.colors.queen[700]
                                    }
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
                        {
                            // quando a mensagem começar com :sticker:, vamos mostrar de outra forma
                            mensagem.texto.startsWith(':sticker:') 
                            ?
                            (
                                <Image 
                                    src={mensagem.texto.replace(':sticker:', '')}
                                    styleSheet={{
                                        maxWidth: '100px',
                                        maxHeight: '100px'
                                    }}
                                /> 
                            )
                            :
                            (mensagem.texto)
                        }
                    </Text>
                )
            })}

        </Box>
    )
}