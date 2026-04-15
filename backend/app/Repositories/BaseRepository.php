<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\QueryBuilder\QueryBuilder;

abstract class BaseRepository
{
    public function __construct(protected Model $model) {}

    public function all(array $columns = ['*'])
    {
        return $this->model->all($columns);
    }

    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->paginate($perPage);
    }

    public function find(int|string $id): ?Model
    {
        return $this->model->find($id);
    }

    public function findOrFail(int|string $id): Model
    {
        return $this->model->findOrFail($id);
    }

    public function create(array $data): Model
    {
        return $this->model->create($data);
    }

    public function update(Model $model, array $data): Model
    {
        $model->update($data);
        return $model->fresh();
    }

    public function delete(Model $model): bool
    {
        return $model->delete();
    }

    public function query(): Builder
    {
        return $this->model->newQuery();
    }

    /**
     * Build query with Spatie QueryBuilder (filters, sorts, includes).
     */
    protected function buildQuery(
        array $allowedFilters = [],
        array $allowedSorts   = [],
        array $allowedIncludes = []
    ): QueryBuilder {
        return QueryBuilder::for($this->model)
            ->allowedFilters($allowedFilters)
            ->allowedSorts($allowedSorts)
            ->allowedIncludes($allowedIncludes);
    }
}
