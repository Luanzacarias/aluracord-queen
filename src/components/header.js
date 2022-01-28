import { Box, Button, Text } from "@skynexui/components";

export function Header() {
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