<div class="chart-container">
    <!-- 그래프 -->
    <div class="container px-3 py-5 p-md-5">
        <div class="pt-5">
            <!-- 연령대 그래프 -->
            <div class="card">
                <div class="card-header">
                    최근 7일간의 교통사고 발생 건수
                </div>
                <div class="card-body">
                    <div class="age-chart-container">
                        <canvas id="accidentAgeChart" width="313" height="253" style="display: block; width: 313px; height: 253px;"></canvas>
                    </div>
                </div>
            </div>
        </div>

        <!-- 시간대 그래프 -->
        <div class="pt-5">
            <div class="card">
                <div class="card-header">
                    시간대별 교통사고 발생 건수
                </div>
                <div class="card-body">
                    <div class="age-chart-container">
                        <canvas id="accidentTimeChart" width="313" height="253" style="display: block; width: 313px; height: 253px; "></canvas>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>