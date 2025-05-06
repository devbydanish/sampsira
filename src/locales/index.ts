
"use server"

import { cookies } from 'next/headers'

import { I18N_LOCALE } from '@/core/constants/constant'
import { LocaleTypes } from '@/core/types'


const COOKIE_NAME = 'NEXT_LOCALE'

export async function getLocale() {
    return cookies().get(COOKIE_NAME)?.value || I18N_LOCALE;
}

export async function setLocale(locale: LocaleTypes) {
    cookies().set(COOKIE_NAME, locale);
}