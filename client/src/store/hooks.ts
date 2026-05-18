import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

//הגדרת סוגים מותאמים אישית לסלקטורים
//  ולדיספאצ'ים של הרדקס כדי להקל על השימוש בהם בקומפוננטות
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
