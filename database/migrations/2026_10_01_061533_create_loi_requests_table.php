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
        Schema::create('loi_requests', function (Blueprint $table) {

            $table->id();
            $table->string('first_name');
            $table->string('middle_name');
            $table->string('last_name');
            $table->string('position');
            $table->string('school');
            $table->string('email');
            $table->enum('status', [
                'Pending',
                'Processing',
                'Completed',
            ])->default('Pending');
            $table->date('request_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loi_requests');
    }
};