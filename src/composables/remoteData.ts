import { ref } from 'vue';
import { Data, Effect, Either, Schema } from 'effect';
import type { ParseError } from 'effect/ParseResult';
export class NetworkError extends Data.TaggedError('NetworkError')<{
    readonly cause: unknown;
}> {}

export class JsonParseError extends Data.TaggedError('JsonParseError')<{
    readonly cause: unknown;
}> {}

export type RemoteData<T, E> = Data.TaggedEnum<{
    NotAsked: object;
    Loading: object;
    Success: { readonly data: T };
    Failure: { readonly error: E };
}>;

export function useRemoteDataEffect<T>(
    fetchEffect: () => Promise<Response>,
    schema?: Schema.Schema<T>,
) {
    const { NotAsked, Loading, Success, Failure } =
        Data.taggedEnum<RemoteData<T, NetworkError | JsonParseError | ParseError>>();

    const state = ref<RemoteData<T, NetworkError | JsonParseError | ParseError>>(NotAsked());

    const fetchData = Effect.gen(function* () {
        state.value = Loading();

        const response = yield* Effect.tryPromise({
            try: fetchEffect,
            catch: (cause) => new NetworkError({ cause }),
        });

        let data = yield* Effect.tryPromise({
            try: () => response.json(),
            catch: (cause) => new JsonParseError({ cause }),
        });

        if (schema) {
            data = yield* Schema.decodeUnknown(schema)(data);
        }

        return data as T;
    });

    const load = async () => {
        const result = await Effect.runPromise(Effect.either(fetchData));

        return Either.match(result, {
            onLeft: (error) => {
                state.value = Failure({ error });
            },
            onRight: (data) => {
                state.value = Success({ data });
            },
        });
    };

    const reset = () => {
        state.value = NotAsked();
    };

    return {
        state,
        load,
        reset,
    };
}
