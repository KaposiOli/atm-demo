# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npm start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

3. Dev Notes

- You'll find 2 pages, one for the Operator (amtply named operator.tsx), and one for the user. I imagined that is what we would want to show as a default, so it remained as index.tsx. Navigation between the 2 is made possible via buttons.
- Everything state related, such as the slice itself, the logic for dispensing notes and the history of transactions, is in the store folder, made via Redux.
- As the description stated that the db of the notes should be kept up to date at ALL times, I persisted the storage, so even if the app is closed and reopened, the state is saved.
- Did not use any UI Lib as I deemed the use-cases straight forward enough not to overengineer it by adding in unnecessary dependencies. Also as a note I did not go overboard with styling as I don't believe this was the main topic of the exercise.
- Tested manually both on IOS and Android simulator.

- The user journeys are quite self explanatory, but as quick rundown:

  - As a User, I can see the withdraw page, on which I can request an amount of cash to withdraw.
  - As a User, after an attempt of withdrawal, if the ATM is capable of fulfilling my request, the transaction will go through, and I see the notes I'm receiving.
  - As a User, after an attempt of withdrawal, if the ATM is incapable of fulfilling my request, the transaction will not go through, and I see an appropriate error message.
  - As a User, after an attempt of withdrawal, if my input is invalid (NaN), I see an appropriate error message.

  - As an Operator, I can see the operator screen and the current state of the ATM.
  - As an Operator, I can reset the ATM to the default state (10 of each note, transaction history erased).
  - As an Operator, I can manually update each note individually, overwriting whatever is currently in the ATM.
  - As an Operator, if my input is invalid (NaN) for the update, I see an appropriate error message and the original value remains unchanged.
  - As an Operator, I can see the Withdrawal History (if there is any), regardless of the transaction's success in chronological order with time, status, amount and the exact amount of each dispensed note.

- Open to any feedback whether this test task passes or not, as I'm looking to improve either ways!
