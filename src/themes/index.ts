import { createTheme, Theme } from '@mui/material/styles'
import typography from './typography'
import outlinedInputStyles from '@/themes/StyledComponent/OutlinedInput'
import buttonStyles from '@/themes/Button/'
import labelStyles from '@/themes/StyledComponent/Label'
import { StyledComponentProps } from '@/types/styledcomponent'
import { CustomButtonProps } from '@/types/button'
import gridStyles from '@/themes/Grid'
import { theme as customPalette } from './palette' // Import the custom palette
import typographyStyles from '@/themes/Typography/typographyStyles'
import formControlStyles from '@/themes/StyledComponent/FormControl'

const theme: Theme = createTheme({
  typography: typography,
  palette: customPalette.palette, // Merge the custom palette into the theme
  components: {
    MuiTypography: {
      styleOverrides: {
        root: ({ ownerState }) => {
          const { fontcolor } = ownerState as CustomButtonProps
          return typographyStyles({
            fontcolor,
          })
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState }) => {
          const { outlinecolor, fontlocation, iconcolor, backgroundcolor } =
            ownerState as CustomButtonProps
          return buttonStyles({
            outlinecolor,
            fontlocation,
            iconcolor,
            backgroundcolor,
          })
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        root: () => {
          return gridStyles()
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ ownerState }) => {
          const {
            componentvariant,
            unshrunkfontcolor,
            shrunkfontcolor,
            combinedfontcolor,
            shrunklabellocation,
          } = ownerState as unknown as StyledComponentProps
          if (componentvariant) {
            return labelStyles({
              componentvariant,
              unshrunkfontcolor,
              shrunkfontcolor,
              combinedfontcolor,
              shrunklabellocation,
            })
          }
          // Provide a default value here
          return labelStyles({
            componentvariant: 'textfield',
            unshrunkfontcolor,
            shrunkfontcolor,
            combinedfontcolor,
            shrunklabellocation,
          })
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: ({ ownerState }) => {
          const {
            outlinecolor,
            backgroundcolor,
            componentvariant,
            unshrunkfontcolor,
            shrunkfontcolor,
            combinedfontcolor,
            iconcolor,
            shrunklabellocation,
            helperfooter,
          } = ownerState as unknown as StyledComponentProps
          if (componentvariant) {
            return {
              ...formControlStyles({
                outlinecolor,
                backgroundcolor,
                componentvariant,
                unshrunkfontcolor,
                shrunkfontcolor,
                combinedfontcolor,
                iconcolor,
                helperfooter,
                shrunklabellocation,
              }),
              ...outlinedInputStyles({
                outlinecolor,
                backgroundcolor,
                componentvariant,
                unshrunkfontcolor,
                combinedfontcolor,
                iconcolor,
                shrunklabellocation,
              }),
            }
          }
          // Provide a default value here
          return {
            ...formControlStyles({
              outlinecolor,
              backgroundcolor,
              componentvariant: 'textfield',
              unshrunkfontcolor,
              shrunkfontcolor,
              combinedfontcolor,
              iconcolor,
              shrunklabellocation,
            }),
            ...outlinedInputStyles({
              outlinecolor,
              backgroundcolor,
              componentvariant: 'textfield',
              unshrunkfontcolor,
              shrunkfontcolor,
              combinedfontcolor,
              iconcolor,
            }),
          }
        },
      },
    },
  },
})

export default theme