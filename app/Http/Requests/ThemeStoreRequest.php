<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ThemeStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:themes,name'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'css_vars' => ['required', 'array'],
            'css_vars.light' => ['required', 'array'],
            'css_vars.dark' => ['required', 'array'],
            'font' => ['nullable', 'array'],
            'font.sans' => ['nullable', 'string', 'max:255'],
            'font.serif' => ['nullable', 'string', 'max:255'],
            'font.mono' => ['nullable', 'string', 'max:255'],
            'css' => ['nullable', 'array'],
            'meta' => ['nullable', 'array'],
        ];
    }
}
