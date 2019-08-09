import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import { MedicoService } from 'app/services/medico/medico.service';
import { HospitalService } from 'app/services/hospital/hospital.service';
import { PacienteService } from 'app/services/paciente/paciente.service';
import { Hospital } from 'app/models/hospital.model';
import { Medico } from 'app/models/medico.model';
import { Paciente } from 'app/models/paciente.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  hospitales: Hospital[] = [];
  hospitalesTotal: string;

  medicos: Medico[] = [];
  medicosTotal: string;

  pacientes: any[] = [];
  pacientesTotal: Paciente[] = [];

  itemHospital: string;
  itemPaciente: string;

  arraypcts = [];
  arrHospitales = [];
  arrMedicos = [];
  arraymd = [];

  constructor(
    public _hospitalService: HospitalService,
    public _medicoService: MedicoService,
    public _pacienteService: PacienteService
  ) { }
  // startAnimationForLineChart(chart){
  //     let seq: any, delays: any, durations: any;
  //     seq = 0;
  //     delays = 80;
  //     durations = 500;

  //     chart.on('draw', function(data) {
  //       if(data.type === 'line' || data.type === 'area') {
  //         data.element.animate({
  //           d: {
  //             begin: 600,
  //             dur: 700,
  //             from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
  //             to: data.path.clone().stringify(),
  //             easing: Chartist.Svg.Easing.easeOutQuint
  //           }
  //         });
  //       } else if(data.type === 'point') {
  //             seq++;
  //             data.element.animate({
  //               opacity: {
  //                 begin: seq * delays,
  //                 dur: durations,
  //                 from: 0,
  //                 to: 1,
  //                 easing: 'ease'
  //               }
  //             });
  //         }
  //     });

  //     seq = 0;
  // };
  // startAnimationForBarChart(chart){
  //     let seq2: any, delays2: any, durations2: any;

  //     seq2 = 0;
  //     delays2 = 80;
  //     durations2 = 500;
  //     chart.on('draw', function(data) {
  //       if(data.type === 'bar'){
  //           seq2++;
  //           data.element.animate({
  //             opacity: {
  //               begin: seq2 * delays2,
  //               dur: durations2,
  //               from: 0,
  //               to: 1,
  //               easing: 'ease'
  //             }
  //           });
  //       }
  //     });

  //     seq2 = 0;
  // };
  ngOnInit() {
    this.totalHospitales();
    this.totalMedicos();
    this.totalPacientes();
      /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */

    //   const dataDailySalesChart: any = {
    //       labels: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
    //       series: [
    //           [12, 17, 7, 17, 23, 18, 38]
    //       ]
    //   };

    //  const optionsDailySalesChart: any = {
    //       lineSmooth: Chartist.Interpolation.cardinal({
    //           tension: 0
    //       }),
    //       low: 0,
    //       high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
    //       chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
    //   }

      // var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

      // this.startAnimationForLineChart(dailySalesChart);


      /* ----------==========     Completed Tasks Chart initialization    ==========---------- */

      // const dataCompletedTasksChart: any = {
      //     labels: ['12p', '3p', '6p', '9p', '12p', '3a', '6a', '9a'],
      //     series: [
      //         [230, 750, 450, 300, 280, 240, 200, 190]
      //     ]
      // };

    //  const optionsCompletedTasksChart: any = {
    //       lineSmooth: Chartist.Interpolation.cardinal({
    //           tension: 0
    //       }),
    //       low: 0,
    //       high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
    //       chartPadding: { top: 0, right: 0, bottom: 0, left: 0}
    //   }

      // var completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);

      // // start animation for the Completed Tasks Chart - Line Chart
      // this.startAnimationForLineChart(completedTasksChart);



      /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

      // var datawebsiteViewsChart = {
      //   labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
      //   series: [
      //     [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]

      //   ]
      // };
      // var optionswebsiteViewsChart = {
      //     axisX: {
      //         showGrid: false
      //     },
      //     low: 0,
      //     high: 1000,
      //     chartPadding: { top: 0, right: 5, bottom: 0, left: 0}
      // };
      // var responsiveOptions: any[] = [
      //   ['screen and (max-width: 640px)', {
      //     seriesBarDistance: 5,
      //     axisX: {
      //       labelInterpolationFnc: function (value) {
      //         return value[0];
      //       }
      //     }
      //   }]
      // ];
      // var websiteViewsChart = new Chartist.Bar('#websiteViewsChart', datawebsiteViewsChart, optionswebsiteViewsChart, responsiveOptions);

      // //start animation for the Emails Subscription Chart
      // this.startAnimationForBarChart(websiteViewsChart);
  }

  totalHospitales() {
    this._pacienteService.cargarPacientes()
      .subscribe((resp: any) => {
        const pacientes = resp.pacientes;
        const arraypcts = [];
        pacientes.forEach(pct => {
          if (pct.hospital !== null) {
            arraypcts.push({id: pct.hospital._id});
          }
        });
        this.arraypcts = arraypcts;

        const arraymd = [];
        pacientes.forEach(md => {
          if (md.medico !== null) {
            arraymd.push({id: md.medico._id});
          }
        });
        this.arraymd = arraymd;
      });

    this._hospitalService.cargarHospitales()
      .subscribe((hospitales: any) => {
        this.hospitales = hospitales.hospitales;
        this.hospitalesTotal = hospitales.total;
        const arrPacientes = [];
        const n = this.arraypcts;
        this.hospitales.forEach(hospital => {
          const idPaciente = hospital._id;
          const pacientes = n.filter(x => x.id === idPaciente);
          arrPacientes.push({
            hospital,
            'pacientes': pacientes.length
          })
        });

        const pacienteFilter = arrPacientes.sort((a, b) => b.pacientes - a.pacientes);
        this.arrHospitales = pacienteFilter.slice(0, 5);
      });

    this._medicoService.cargarMedicos()
      .subscribe((medicos: any) => {
        this.medicos = medicos.medicos;
        this.medicosTotal = medicos.total;
        const arrPacientes = [];
        const n = this.arraymd;
        this.medicos.forEach(medico => {
          const idPaciente = medico._id;
          const pacientes = n.filter(x => x.id === idPaciente);
          arrPacientes.push({
            medico,
            'pacientes': pacientes.length
          })
        });

        const pacienteFilter = arrPacientes.sort((a, b) => b.pacientes - a.pacientes);
        this.arrMedicos = pacienteFilter.slice(0, 5);
      });
  }

  totalMedicos() {
    this._medicoService.cargarMedicos()
      .subscribe((medicos: any) => {
        this.medicosTotal = medicos.medicos.length;
      });
  }

  totalPacientes() {
    this._pacienteService.cargarPacientes()
      .subscribe((pacientes: any) => {
        this.pacientesTotal = pacientes.pacientes.length;
      });
  }

}
