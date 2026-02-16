### CAREPLUS HOME PAGE

A Patient Form designed to be fast, accurate, and user-friendly, ensuring every patient has a smooth experience from start to finish.

## key features

- 🧩 Component reusability & DRY principles
- 🛡️ Type safety (compile + runtime validation)
- ⚡ Optimized form state management (React Hook Form)
- 🚨 Comprehensive error handling with UX focus (try/catch blocks)

## CAREPLUS REGISTRATION PAGE

Complete medical intake and registration system for new patients.Collects comprehensive patient collection, medical history, and identification documents before enabling appointment booking.

## key features

- 🎯 Smart Form Pre-population (Auto-fills user details from sign-up)
- 📋 Comprehensive Medical Intake (Captures personal, medical, and insurance information)
- 📎 Secure Document Upload (Drag-and-drop file handling for ID verification)
- ✅ Real-time Form Validation (Instant feedback with Zod schema validation)
- 🔄 Seamless Patient Flow (Auto-redirects to appointment booking upon completion)

- 🧩 Component reusability & DRY principles
- 🛡️ Type safety (compile + runtime validation)
- ⚡ Optimized form state management (React Hook Form)
- 🚨 Comprehensive error handling with UX focus (try/catch blocks)

## CAREPLUS SUCCESS PAGE

Displays appointment confirmation page with patient details, assigned doctor information, and appointment scheduling data. Includes async data fetching from Appwrite database and error handling for robust user experience.

## Key features

- ✅Appointment confirmation with success animation
- 👨‍⚕️Doctor profile display (photo & name)
- 📅Formatted appointment date/time
- 🔄Quick re-booking functionality
- 🛡️Error handling for database operations

## CAREPLUS ADMIN VERIFICATION

Security modal component that protects admin routes with 6-digit passkey verification, handles user authentication, encrypted session storage, and automatic route redirection based on access validation.

## key features

- 🔐 Secure 6-digit OTP-style passkey input
- 🔒 Encrypted local storage for session persistence
- 🚨 Real-time validation with user-friendly error messages
- 🔄 Automatic route protection and redirection handling

<!-- [KEY QUESTIONS]

### why does the onSubmit function need to be an async function during API calls?

When communicating with external systems such as API'S and databases, async is JavaScript's way of handling operations that take time without freezing the user interface.Still keeping things fast and responsive for the user.

### Purpose of Try/catch??

Error Handling(network failures,server crashes,dtb downtime); ensures the app can continue running - upon recovery - without resulting in a crash even when external systems fail, and users get helpful feedback instead of technical error messages.

### Purpose of process.env??

Stores environment-specific configurations; configurations referring to values set outside code and vary by environment.
 -->

<!-- [NEW LEARNT KEY CONCEPTS]

- Appwrite?? :

  Baas platform that provides a complete backend (database, auth, storage, messaging, APIs) out of the box, so apps can be built faster without worrying about backend infrastructure.

- React Hook Form??

- Typescript interfaces,enums.??

ENUMS : Enums allow a developer to define a set of named constants, making it easier to create a set of distinct cases. They work best in a closed set of known values that won't change frequently, and when values are referenced across multiple files.

INTERFACE : Useful for defining object shapes and contracts(agreements about the shape and behavior of data)

Key differences ?? Enums represent a set of fixed values, interfaces represent a structure that can be extended and merged. -->
