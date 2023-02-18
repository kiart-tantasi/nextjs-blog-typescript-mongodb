import { GetServerSidePropsContext, NextApiResponse, NextPage } from 'next'
import React from 'react'

import Form from '../../components/form/Form'
import { removeTokenCookie } from '../../lib/auth-cookie'
import { isTokenValid } from '../../lib/jwt-token-validation'

const NewArticle: NextPage = () => {
    return <Form editMode={false} />
}
export default NewArticle

export async function getServerSideProps(context: GetServerSidePropsContext) {
    // ------------------------------------- //
    // THIS IS TEMP MIDDLEWARE
    // TODO: use /middleware.ts instead
    const cookies = context.req.cookies
    const token = cookies['token']
    if (!token || !isTokenValid(token)) {
        removeTokenCookie(context.res as NextApiResponse)
        return {
            redirect: {
                destination: '/workspace'
            },
            props: {}
        }
    }
    // ------------------------------------- //
    return {
        props: {}
    }
}
