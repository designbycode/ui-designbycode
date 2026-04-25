<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('registries', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('type');
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->string('author')->nullable();
            $table->json('dependencies')->nullable();
            $table->json('devDependencies')->nullable();
            $table->json('registryDependencies')->nullable();
            $table->longText('files')->nullable();
            $table->longText('tailwind')->nullable();
            $table->json('envVars')->nullable();
            $table->longText('docs')->nullable();
            $table->json('categories')->nullable();
            $table->string('extends')->nullable();
            $table->string('style')->nullable();
            $table->string('iconLibrary')->nullable();
            $table->string('baseColor')->nullable();
            $table->string('theme')->nullable();
            $table->json('meta');
            $table->json('font')->nullable();
            $table->json('css_vars')->nullable();
            $table->json('css')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('registries');
    }
};
