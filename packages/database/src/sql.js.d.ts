declare module 'sql.js' {
  export interface Database {
    run(sql: string, params?: unknown[]): Database;
    exec(sql: string, params?: unknown[]): QueryExecResult[];
    prepare(sql: string): Statement;
    export(): Uint8Array;
    close(): void;
    getRowsModified(): number;
  }

  interface DatabaseConstructor {
    new (data?: ArrayLike<number> | Buffer | null): Database;
  }

  export interface Statement {
    bind(params?: unknown[]): boolean;
    step(): boolean;
    getAsObject(params?: Record<string, unknown>): Record<string, unknown>;
    get(params?: unknown[]): unknown[];
    free(): boolean;
    reset(): void;
    run(params?: unknown[]): void;
  }

  export interface QueryExecResult {
    columns: string[];
    values: unknown[][];
  }

  export interface SqlJsStatic {
    Database: DatabaseConstructor;
  }

  export default function initSqlJs(
    config?: Record<string, unknown>
  ): Promise<SqlJsStatic>;
}
