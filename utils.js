const buildYearBasis = () => {
    const yearBasisObject = [{ date: 'Agosto 2022' }, { date: 'Julio 2022' }, { date: 'Junio 2022' },
        { date: 'Mayo 2022' }, { date: 'Abril 2022' }, { date: 'Marzo 2022' }, { date: 'Febrero 2022' },
        { date: 'Enero 2022' }, { date: 'Diciembre 2021' }, { date: 'Noviembre 2021' },
        { date: 'Octubre 2021' }, { date: 'Septiembre 2021' }
    ]

    const date = new Date('2022-09-01');

    for (let index = 0; index < yearBasisObject.length; index++) {
        const monthMetadata = yearBasisObject[index];
        
        const indexToGetPreviousMonth = -(index);
        monthMetadata.startDate = new Date(Date.UTC(date.getFullYear(), date.getMonth() + indexToGetPreviousMonth, 1, 0, 0, 0)).toISOString();
        monthMetadata.endDate = new Date(Date.UTC(date.getFullYear(), date.getMonth() + indexToGetPreviousMonth + 1, 0, 23, 59, 59)).toISOString();
    }

    return yearBasisObject;
}

export default buildYearBasis;