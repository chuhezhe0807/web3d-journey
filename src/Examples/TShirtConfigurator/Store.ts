import {configureStore, createSlice} from "@reduxjs/toolkit";

const configuratorSlice = createSlice({
    name: "configuratorState",
    initialState: {
        intro: true,
        colors: ['#ccc', '#EFBD4E', '#80C670', '#726DE8', '#EF674E', '#353934'],
        decals: ['react', 'three2', 'pmndrs'],
        color: '#EFBD4E',
        decal: 'three2'
    },
    reducers: {
        setIntro: (state, action) => {
            state.intro = action.payload;
        },
        setColor: (state, action) => {
            state.color = action.payload;
        },
        setDecal: (state, action) => {
            state.decal = action.payload;
        }
    }
});

const store = configureStore({reducer: configuratorSlice.reducer});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const {setColor, setDecal, setIntro} = configuratorSlice.actions;
export default store;

// 新的 @reduxjs/toolkit 已经整合了 immer ，不需要再自己维护不可变状态了
// type State = {
//     intro: boolean;
// } & {[key in "color" | "decal"]: string;} & {[key in "colors" | "decals"]: string[];}

// type ReturnActionValue<Key extends string = string, U extends any = any> = {
//     [key in Key]: U;
// };

// type ReturnActionType<T extends keyof typeof configuratorState, U = keyof typeof ActionTypeEnum> = 
//     U extends `SET_${infer R}`
//         ? Lowercase<R> extends T
//             ? {type: `__${U}__`}
//             : never
//         : never;

// type ActionType<T extends keyof typeof configuratorState, U = (typeof MUTABLE_STATE)[number]> = 
//     T extends U 
//         ? ReturnActionValue<T, (typeof configuratorState)[T]> & ReturnActionType<T>
//         : never
        
// const MUTABLE_STATE = ["intro", "color", "decal"] as const;

// const enum ActionTypeEnum {
//     SET_INTRO = "__SET_INTRO__",
//     SET_COLOR = "__SET_COLOR__",
//     SET_DECAL = "__SET_DECAL__"
// }

// const configuratorState = {
//     intro: true,
//     colors: ['#ccc', '#EFBD4E', '#80C670', '#726DE8', '#EF674E', '#353934'],
//     decals: ['react', 'three2', 'pmndrs'],
//     color: '#EFBD4E',
//     decal: 'three2'
// };

// const setIntro = (intro: boolean): ActionType<"intro"> => ({type: ActionTypeEnum.SET_INTRO, intro});
// const setColor = (color: string): ActionType<"color"> => ({type: ActionTypeEnum.SET_COLOR, color});
// const setDecal = (decal: string): ActionType<"decal"> => ({type: ActionTypeEnum.SET_DECAL, decal});

// const reducer = <T extends typeof MUTABLE_STATE[number]> (state: State = configuratorState, action: ActionType<T>) => {
//     produce(
//         state,
//         (draftState) => {
//             switch(action.type) {
//                 case ActionTypeEnum.SET_COLOR:
//                     draftState.color = action.color;
//                     break;
//                 case ActionTypeEnum.SET_INTRO:
//                     draftState.intro = action.intro;
//                     break;
//                 case ActionTypeEnum.SET_DECAL:
//                     draftState.decal = action.decal;
//                     break;
//                 default:
//                     return draftState;
//             }
//         }
//     )
// }
