export type Errors = {
        name?: string[]
        email?: string[]
        password?: string[]
        password_confirmation?: string[]
}

export type SigninPayload = {
        email: FormDataEntryValue | null
        password: FormDataEntryValue | null
}