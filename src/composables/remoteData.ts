import { ref } from 'vue'
import { Data, Effect } from 'effect'

// Define custom error types
export class NetworkError extends Data.TaggedError('NetworkError')<{
  readonly cause: unknown
}> {}

export class JsonParseError extends Data.TaggedError('JsonParseError')<{
  readonly cause: unknown
}> {}

export type RemoteData<T, E> = Data.TaggedEnum<{
  NotAsked: object
  Loading: object
  Success: { readonly data: T }
  Failure: { readonly error: E }
}>

export function useRemoteDataEffect<T>(fetchEffect: () => Promise<Response>) {
  const { NotAsked, Loading, Success, Failure } =
    Data.taggedEnum<RemoteData<T, NetworkError | JsonParseError>>()

  const state = ref<RemoteData<T, NetworkError | JsonParseError>>(NotAsked())

  const fetchData = Effect.gen(function* () {
    state.value = Loading()

    const response = yield* Effect.sandbox(Effect.promise(() => fetchEffect())).pipe(
      Effect.catchAll((error) => new NetworkError({ cause: error })),
    )

    const data = yield* Effect.tryPromise({
      try: () => response.json() as Promise<T>,
      catch: (cause) => new JsonParseError({ cause }),
    })

    state.value = Success({ data })
  }).pipe(
    Effect.catchTags({
      NetworkError: (error) => {
        state.value = Failure({ error })
        return Effect.fail(error)
      },
      JsonParseError: (error) => {
        state.value = Failure({ error })
        return Effect.fail(error)
      },
    }),
  )

  const runLoad = () => Effect.runPromise(fetchData)

  const reset = () => {
    state.value = NotAsked()
  }

  return {
    state,
    load: runLoad,
    reset,
  }
}
